// src/app/lib/validators.ts

export interface ValidationResult {
  valid: boolean
  error?: string
  sanitized?: string
}

// 🔥 ADD THIS PASSWORD VALIDATOR
export function validatePassword(password: string): ValidationResult {
  // Check if password exists
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      error: 'Password is required'
    }
  }

  // Check minimum length
  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long'
    }
  }

  // Check maximum length (prevent DoS attacks with very long passwords)
  if (password.length > 128) {
    return {
      valid: false,
      error: 'Password must be less than 128 characters'
    }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter'
    }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one lowercase letter'
    }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one number'
    }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one special character (!@#$%^&* etc.)'
    }
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty', 'abc123',
    'password1', 'admin123', 'letmein', 'welcome', 'monkey',
    'iloveyou', 'princess', 'dragon', 'sunshine', 'master'
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      valid: false,
      error: 'This password is too common. Please choose a stronger password'
    }
  }

  // Check for sequential characters (123, abc, etc.)
  // const sequentialPatterns = [
  //   '123', '234', '345', '456', '567', '678', '789',
  //   'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi'
  // ]

  // if (sequentialPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
  //   return {
  //     valid: false,
  //     error: 'Password contains sequential characters. Please choose a stronger password'
  //   }
  // }

  return {
    valid: true,
    sanitized: password // Don't trim or modify password
  }
}

export function validateSubCategory(input: string): ValidationResult {
  // Check if input exists
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      error: 'SubCategory is required'
    }
  }

  // Trim whitespace
  const sanitized = input.trim()

  // Check minimum length
  if (sanitized.length < 3) {
    return {
      valid: false,
      error: 'SubCategory must be at least 3 characters long'
    }
  }

  // Check maximum length
  if (sanitized.length > 100) {
    return {
      valid: false,
      error: 'SubCategory must be less than 100 characters'
    }
  }

  // Validate characters (allow letters, numbers, spaces, hyphens, ampersands, slashes, parentheses)
  const validPattern = /^[a-zA-Z0-9\s\-&/().,]+$/
  if (!validPattern.test(sanitized)) {
    return {
      valid: false,
      error: 'SubCategory contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed.'
    }
  }

  // Check for excessive repeating characters (spam prevention)
  const repeatingPattern = /(.)\1{5,}/
  if (repeatingPattern.test(sanitized)) {
    return {
      valid: false,
      error: 'SubCategory contains too many repeating characters'
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
    /document\./i,
    /window\./i
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(sanitized))) {
    return {
      valid: false,
      error: 'SubCategory contains suspicious content'
    }
  }

  return {
    valid: true,
    sanitized
  }
}

export function validateEmail(email: string): ValidationResult {
  // Check if email exists
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      error: 'Email is required'
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailPattern.test(email)) {
    return {
      valid: false,
      error: 'Invalid email address format'
    }
  }

  if (email.length > 254) {
    return {
      valid: false,
      error: 'Email address too long'
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /^admin@/i,
    /^root@/i,
    /^postmaster@/i,
    /^abuse@/i
  ]

  // Optional: warn but don't block system emails
  // if (suspiciousPatterns.some(pattern => pattern.test(email))) {
  //   return {
  //     valid: false,
  //     error: 'This email address is not allowed'
  //   }
  // }

  return {
    valid: true,
    sanitized: email.toLowerCase().trim()
  }
}

export function validatePhone(phone: string): ValidationResult {
  const sanitized = phone.replace(/[\s\-()]/g, '')
  
  if (sanitized.length < 10 || sanitized.length > 15) {
    return {
      valid: false,
      error: 'Phone number must be between 10 and 15 digits'
    }
  }

  const phonePattern = /^[+]?[\d]+$/
  if (!phonePattern.test(sanitized)) {
    return {
      valid: false,
      error: 'Phone number contains invalid characters'
    }
  }

  return {
    valid: true,
    sanitized
  }
}

export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { valid: true, sanitized: '' } // URL is optional
  }

  try {
    const parsed = new URL(url)
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return {
        valid: false,
        error: 'URL must use http or https protocol'
      }
    }

    // Check for suspicious domains (optional - adjust based on your needs)
    // Localhost is ok for development
    // const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0']
    // if (process.env.NODE_ENV === 'production' && 
    //     suspiciousDomains.some(domain => parsed.hostname.includes(domain))) {
    //   return {
    //     valid: false,
    //     error: 'URL contains suspicious domain'
    //   }
    // }

    return {
      valid: true,
      sanitized: url
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format'
    }
  }
}

export function sanitizeString(input: string, maxLength: number = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove angle brackets
}

// 🔥 OPTIONAL: Name validator
export function validateName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: true, sanitized: '' } // Name is optional
  }

  const sanitized = name.trim()

  if (sanitized.length > 100) {
    return {
      valid: false,
      error: 'Name must be less than 100 characters'
    }
  }

  // Allow letters, spaces, hyphens, apostrophes
  const namePattern = /^[a-zA-Z\s\-']+$/
  if (!namePattern.test(sanitized)) {
    return {
      valid: false,
      error: 'Name contains invalid characters'
    }
  }

  return {
    valid: true,
    sanitized
  }
}