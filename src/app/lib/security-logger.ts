// src/app/lib/security-logger.ts

export enum SecurityEventType {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  AUTH_FAILURE = 'AUTH_FAILURE',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
}

interface SecurityLogEntry {
  timestamp: Date
  type: SecurityEventType
  ip: string
  userAgent: string
  userId?: number | string // 🆕 Allow string too (for flexibility)
  endpoint: string
  details?: any
}

class SecurityLogger {
  private logs: SecurityLogEntry[] = []
  private maxLogs = 1000

  log(entry: Omit<SecurityLogEntry, 'timestamp'>) {
    const logEntry: SecurityLogEntry = {
      ...entry,
      timestamp: new Date()
    }

    this.logs.push(logEntry)

    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${entry.type}:`, {
        ip: entry.ip,
        endpoint: entry.endpoint,
        userId: entry.userId,
        details: entry.details
      })
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry, LogRocket, etc.
    }
  }

  getRecentLogs(count: number = 100): SecurityLogEntry[] {
    return this.logs.slice(-count)
  }

  getLogsByIp(ip: string): SecurityLogEntry[] {
    return this.logs.filter(log => log.ip === ip)
  }

  getLogsByType(type: SecurityEventType): SecurityLogEntry[] {
    return this.logs.filter(log => log.type === type)
  }

  getLogsByUserId(userId: number | string): SecurityLogEntry[] {
    return this.logs.filter(log => log.userId === userId)
  }

  clearLogs() {
    this.logs = []
  }
}

export const securityLogger = new SecurityLogger()

export function getRequestInfo(request: Request): { ip: string; userAgent: string; endpoint: string } {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const endpoint = new URL(request.url).pathname

  return { ip, userAgent, endpoint }
}