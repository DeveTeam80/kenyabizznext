// src/app/lib/security-helpers.ts
import { securityLogger, SecurityEventType, getRequestInfo } from './security-logger'
import { JWTPayload } from 'jose' // 👈 add this import

interface Session extends JWTPayload {
  userId?: number | string
  role?: string
  [key: string]: any
}

export function logSecurityEvent(
  type: SecurityEventType,
  request: Request,
  session: Session | null | any, // 🔥 Accept any type
  details?: any
) {
  const requestInfo = getRequestInfo(request)
  
  // 🔥 Safely extract userId regardless of session structure
  const userId = session?.userId || session?.sub || session?.id
  
  securityLogger.log({
    type,
    ...requestInfo,
    userId: userId ? Number(userId) : undefined,
    details
  })
}

export function logRateLimitExceeded(request: Request, session: Session | null | any, resetTime: number) {
  logSecurityEvent(
    SecurityEventType.RATE_LIMIT_EXCEEDED,
    request,
    session,
    { resetTime: new Date(resetTime).toISOString() }
  )
}

export function logUnauthorizedAccess(request: Request, session: Session | null | any, reason: string) {
  logSecurityEvent(
    SecurityEventType.UNAUTHORIZED_ACCESS,
    request,
    session,
    { reason }
  )
}

export function logInvalidInput(request: Request, session: Session | null | any, field: string, value: any) {
  logSecurityEvent(
    SecurityEventType.INVALID_INPUT,
    request,
    session,
    { field, value }
  )
}

export function logSuspiciousActivity(request: Request, session: Session | null | any, details: any) {
  logSecurityEvent(
    SecurityEventType.SUSPICIOUS_ACTIVITY,
    request,
    session,
    details
  )
}

export function logAuthSuccess(request: Request, session: Session | any, action: string, details?: any) {
  logSecurityEvent(
    SecurityEventType.AUTH_SUCCESS,
    request,
    session,
    { action, ...details }
  )
}