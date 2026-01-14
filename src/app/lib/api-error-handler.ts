// src/app/lib/api-error-handler.ts
// Secure error handling for API routes - prevents exposing sensitive data in production

import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

const isProduction = process.env.NODE_ENV === 'production'

// Error types for proper categorization
export enum ApiErrorType {
    VALIDATION = 'VALIDATION_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    CONFLICT = 'CONFLICT',
    RATE_LIMIT = 'RATE_LIMIT',
    DATABASE = 'DATABASE_ERROR',
    INTERNAL = 'INTERNAL_ERROR',
}

// Safe error messages for production (no internal details)
const safeErrorMessages: Record<ApiErrorType, string> = {
    [ApiErrorType.VALIDATION]: 'Invalid request data',
    [ApiErrorType.NOT_FOUND]: 'Resource not found',
    [ApiErrorType.UNAUTHORIZED]: 'Authentication required',
    [ApiErrorType.FORBIDDEN]: 'Access denied',
    [ApiErrorType.CONFLICT]: 'Resource conflict',
    [ApiErrorType.RATE_LIMIT]: 'Too many requests. Please try again later.',
    [ApiErrorType.DATABASE]: 'A database error occurred. Please try again.',
    [ApiErrorType.INTERNAL]: 'An unexpected error occurred. Please try again.',
}

// HTTP status codes for each error type
const errorStatusCodes: Record<ApiErrorType, number> = {
    [ApiErrorType.VALIDATION]: 400,
    [ApiErrorType.NOT_FOUND]: 404,
    [ApiErrorType.UNAUTHORIZED]: 401,
    [ApiErrorType.FORBIDDEN]: 403,
    [ApiErrorType.CONFLICT]: 409,
    [ApiErrorType.RATE_LIMIT]: 429,
    [ApiErrorType.DATABASE]: 500,
    [ApiErrorType.INTERNAL]: 500,
}

interface ApiErrorOptions {
    type: ApiErrorType
    message?: string        // Custom message (shown in dev, hidden in prod)
    details?: any          // Additional details (never shown in prod)
    logError?: boolean     // Whether to log (default: true)
}

/**
 * Create a safe API error response
 * - In development: Shows detailed error info
 * - In production: Shows only safe, generic messages
 */
export function createErrorResponse(options: ApiErrorOptions) {
    const { type, message, details, logError = true } = options

    // Always log errors server-side
    if (logError) {
        console.error(`[API Error] ${type}:`, message, details || '')
    }

    const statusCode = errorStatusCodes[type]

    // In production, only return safe generic messages
    if (isProduction) {
        return NextResponse.json(
            {
                error: safeErrorMessages[type],
                type: type,
                timestamp: new Date().toISOString()
            },
            { status: statusCode }
        )
    }

    // In development, return detailed error info for debugging
    return NextResponse.json(
        {
            error: message || safeErrorMessages[type],
            type: type,
            ...(details && { details }),
            timestamp: new Date().toISOString()
        },
        { status: statusCode }
    )
}

/**
 * Handle unexpected errors (catch blocks)
 * Categorizes Prisma errors and other exceptions
 */
export function handleApiError(error: unknown, context?: string): NextResponse {
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            return createErrorResponse({
                type: ApiErrorType.CONFLICT,
                message: 'A record with this value already exists',
                details: isProduction ? undefined : { code: error.code, meta: error.meta }
            })
        }

        // Record not found
        if (error.code === 'P2025') {
            return createErrorResponse({
                type: ApiErrorType.NOT_FOUND,
                message: 'Record not found',
                details: isProduction ? undefined : { code: error.code }
            })
        }

        // Foreign key constraint
        if (error.code === 'P2003') {
            return createErrorResponse({
                type: ApiErrorType.VALIDATION,
                message: 'Invalid reference to related record',
                details: isProduction ? undefined : { code: error.code }
            })
        }

        // Other Prisma errors
        return createErrorResponse({
            type: ApiErrorType.DATABASE,
            message: isProduction ? undefined : `Database error: ${error.message}`,
            details: isProduction ? undefined : { code: error.code, meta: error.meta }
        })
    }

    // Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        return createErrorResponse({
            type: ApiErrorType.VALIDATION,
            message: 'Invalid data format',
            details: isProduction ? undefined : error.message
        })
    }

    // Prisma initialization errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return createErrorResponse({
            type: ApiErrorType.DATABASE,
            message: 'Database connection error',
            details: isProduction ? undefined : error.message
        })
    }

    // Standard Error objects
    if (error instanceof Error) {
        return createErrorResponse({
            type: ApiErrorType.INTERNAL,
            message: isProduction ? undefined : error.message,
            details: isProduction ? undefined : {
                context,
                stack: error.stack?.split('\n').slice(0, 5).join('\n')
            }
        })
    }

    // Unknown error type
    return createErrorResponse({
        type: ApiErrorType.INTERNAL,
        message: 'An unexpected error occurred',
        details: isProduction ? undefined : { context, error: String(error) }
    })
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler(
    handler: (request: Request, context: any) => Promise<NextResponse>
) {
    return async (request: Request, context: any): Promise<NextResponse> => {
        try {
            return await handler(request, context)
        } catch (error) {
            return handleApiError(error, request.url)
        }
    }
}
