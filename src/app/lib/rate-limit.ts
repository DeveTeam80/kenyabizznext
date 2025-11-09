// src/app/lib/rate-limit.ts

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
  blockUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime && (!entry.blocked || (entry.blockUntil && now > entry.blockUntil))) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  limit: number // Max requests
  windowMs: number // Time window in milliseconds
  blockDurationMs?: number // How long to block after exceeding limit
}

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = { 
    limit: 20, 
    windowMs: 60000, // 1 minute
    blockDurationMs: 5 * 60000 // 5 minutes
  }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Check if blocked
  if (entry?.blocked && entry.blockUntil && now < entry.blockUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil
    }
  }

  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false
    })
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime: now + config.windowMs
    }
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.limit) {
    entry.blocked = true
    entry.blockUntil = now + (config.blockDurationMs || config.windowMs)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockUntil
    }
  }

  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime
  }
}

// Get identifier from request (IP address)
export function getIdentifier(request: Request): string {
  // Try multiple headers for IP (useful behind proxies/CDNs)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip
}