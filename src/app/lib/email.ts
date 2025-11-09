// src/app/lib/email.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'Kenya Bizz Directory <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('❌ Resend error:', error)
      return { success: false, error }
    }

    console.log('✅ Email sent:', data?.id)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Email exception:', error)
    return { success: false, error: error.message }
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

// Base email template wrapper
const getEmailTemplate = (content: string, headerTitle: string, headerBg: string = '#146835') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${headerTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6; 
      color: #2a2a2a;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-wrapper {
      width: 100%;
      background-color: #f7f7f7;
      padding: 40px 20px;
    }
    
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .logo-section {
      background: #ffffff;
      padding: 35px 40px 30px;
      text-align: center;
      border-bottom: 3px solid ${headerBg};
    }
    
    .logo-section img {
      max-width: 160px;
      height: auto;
      display: inline-block;
    }
    
    .logo-fallback {
      color: ${headerBg};
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .header { 
      background: ${headerBg};
      color: #ffffff; 
      padding: 40px 40px 50px; 
      text-align: center; 
    }
    
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    
    .header p {
      margin: 12px 0 0;
      font-size: 16px;
      opacity: 0.95;
      font-weight: 400;
    }
    
    .content { 
      padding: 50px 40px; 
      background: #ffffff;
    }
    
    .content p {
      margin: 0 0 20px;
      font-size: 16px;
      color: #2a2a2a;
      line-height: 1.7;
    }
    
    .content p:last-child {
      margin-bottom: 0;
    }
    
    .content strong {
      color: #146835;
      font-weight: 600;
    }
    
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    
    .button { 
      display: inline-block; 
      padding: 16px 48px; 
      background: #146835;
      color: #ffffff !important; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(20, 104, 53, 0.25);
    }
    
    .button:hover {
      background: #125e30;
      box-shadow: 0 6px 16px rgba(20, 104, 53, 0.35);
      transform: translateY(-1px);
    }
    
    .link-box {
      background: #f7f7f7;
      border: 1px solid #efefef;
      border-radius: 8px;
      padding: 18px;
      margin: 30px 0;
      word-break: break-all;
      font-size: 14px;
      color: #8c8c8c;
      font-family: 'Courier New', monospace;
      line-height: 1.6;
    }
    
    .info-box {
      background: #d3eadb;
      border-left: 4px solid #146835;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
    }
    
    .info-box-title {
      font-weight: 600;
      font-size: 15px;
      color: #146835;
      margin-bottom: 12px;
      display: block;
    }
    
    .info-box ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .info-box li {
      margin: 8px 0;
      font-size: 15px;
      color: #2a2a2a;
      line-height: 1.6;
    }
    
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 8px;
      padding: 24px;
      margin: 30px 0;
    }
    
    .warning-box-title {
      font-weight: 600;
      font-size: 15px;
      color: #856404;
      margin-bottom: 12px;
      display: block;
    }
    
    .warning-box ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .warning-box li {
      margin: 8px 0;
      font-size: 15px;
      color: #2a2a2a;
      line-height: 1.6;
    }
    
    .features-box {
      background: #f7f7f7;
      border-radius: 10px;
      padding: 30px;
      margin: 30px 0;
    }
    
    .features-box-title {
      font-weight: 600;
      font-size: 18px;
      color: #2a2a2a;
      margin-bottom: 16px;
    }
    
    .features-box ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }
    
    .features-box li {
      margin: 12px 0;
      font-size: 15px;
      color: #2a2a2a;
      line-height: 1.6;
      padding-left: 28px;
      position: relative;
    }
    
    .features-box li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #146835;
      font-weight: 700;
      font-size: 18px;
    }
    
    .divider {
      margin: 40px 0;
      padding-top: 40px;
      border-top: 1px solid #efefef;
    }
    
    .footer { 
      text-align: center; 
      padding: 40px 40px; 
      font-size: 14px; 
      color: #8c8c8c;
      background: #f7f7f7;
      border-top: 1px solid #efefef;
    }
    
    .footer p {
      margin: 0 0 12px;
      line-height: 1.6;
    }
    
    .footer a {
      color: #146835;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .footer a:hover {
      color: #125e30;
    }
    
    .footer-links {
      margin-top: 16px;
    }
    
    .footer-links a {
      margin: 0 12px;
    }
    
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }
      
      .container {
        border-radius: 8px;
      }
      
      .logo-section {
        padding: 25px 24px 20px;
      }
      
      .header {
        padding: 30px 24px 40px;
      }
      
      .header h1 {
        font-size: 26px;
      }
      
      .content {
        padding: 35px 24px;
      }
      
      .footer {
        padding: 30px 24px;
      }
      
      .button {
        padding: 14px 36px;
        font-size: 15px;
      }
      
      .features-box,
      .info-box,
      .warning-box {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="logo-section">
        <img src="https://kenyabizzdirectory.com/img/logo/logoa.png" alt="Kenya Bizz Directory" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <div class="logo-fallback" style="display: none;">KENYA BIZZ DIRECTORY</div>
      </div>
      ${content}
    </div>
  </div>
</body>
</html>
`

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  const content = `
    <div class="header">
      <h1>Verify Your Email Address</h1>
      <p>Complete your registration to get started</p>
    </div>
    <div class="content">
      <p>Welcome to <strong>Kenya Bizz Directory</strong>!</p>
      
      <p>Thank you for signing up. To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
      
      <div class="button-container">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>Alternatively, you can copy and paste this link into your browser:</p>
      <div class="link-box">${verificationUrl}</div>
      
      <div class="info-box">
        <span class="info-box-title">Security Information</span>
        <ul>
          <li>This verification link will expire in <strong>24 hours</strong></li>
          <li>If you didn't create an account with us, please ignore this email</li>
          <li>Never share this verification link with anyone</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kenya Bizz Directory. All rights reserved.</p>
      <div class="footer-links">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}">Visit Website</a>
        <span style="color: #efefef;">|</span>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a>
      </div>
    </div>
  `

  const html = getEmailTemplate(content, 'Verify Your Email - Kenya Bizz Directory')

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Kenya Bizz Directory',
    html,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  const content = `
    <div class="header">
      <h1>Reset Your Password</h1>
      <p>Secure your account with a new password</p>
    </div>
    <div class="content">
      <p>We received a request to reset the password for your Kenya Bizz Directory account.</p>
      
      <p>Click the button below to create a new password:</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p>Alternatively, you can copy and paste this link into your browser:</p>
      <div class="link-box">${resetUrl}</div>
      
      <div class="warning-box">
        <span class="warning-box-title">Important Security Notice</span>
        <ul>
          <li>This password reset link will expire in <strong>1 hour</strong></li>
          <li>If you didn't request a password reset, please ignore this email</li>
          <li>Your current password will remain unchanged until you set a new one</li>
          <li>For security concerns, contact our support team immediately</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kenya Bizz Directory. All rights reserved.</p>
      <div class="footer-links">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}">Visit Website</a>
        <span style="color: #efefef;">|</span>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a>
      </div>
    </div>
  `

  const html = getEmailTemplate(content, 'Reset Your Password - Kenya Bizz Directory')

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Kenya Bizz Directory',
    html,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const content = `
    <div class="header">
      <h1>Welcome to Kenya Bizz Directory</h1>
      <p>Your account has been successfully verified</p>
    </div>
    <div class="content">
      <p>Hello <strong>${name || 'there'}</strong>,</p>
      
      <p>Your email has been verified successfully! We're excited to have you as part of the Kenya Bizz Directory community.</p>
      
      <div class="features-box">
        <div class="features-box-title">What you can do now:</div>
        <ul>
          <li>Add and manage your business listings across Kenya</li>
          <li>Connect with other businesses and expand your network</li>
          <li>Access premium features and business insights</li>
          <li>Track your business performance with analytics</li>
          <li>Receive inquiries directly from potential customers</li>
        </ul>
      </div>
      
      <p>Get started by visiting your dashboard and creating your first listing:</p>
      
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
      
      <div class="divider">
        <p>If you have any questions or need assistance, our support team is here to help. Feel free to reach out anytime.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kenya Bizz Directory. All rights reserved.</p>
      <div class="footer-links">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}">Visit Website</a>
        <span style="color: #efefef;">|</span>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a>
        <span style="color: #efefef;">|</span>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Dashboard</a>
      </div>
    </div>
  `

  const html = getEmailTemplate(content, 'Welcome to Kenya Bizz Directory', '#1a8242')

  return sendEmail({
    to: email,
    subject: 'Welcome to Kenya Bizz Directory',
    html,
  })
}

export async function sendAccountLockedEmail(email: string, unlockTime: Date) {
  const minutesRemaining = Math.ceil((unlockTime.getTime() - Date.now()) / 60000)

  const content = `
    <div class="header">
      <h1>Account Temporarily Locked</h1>
      <p>Security measure activated</p>
    </div>
    <div class="content">
      <p>Your Kenya Bizz Directory account has been temporarily locked due to multiple failed login attempts.</p>
      
      <div class="warning-box">
        <span class="warning-box-title">Account Status</span>
        <ul>
          <li>Your account will be automatically unlocked in <strong>${minutesRemaining} minutes</strong></li>
          <li>This is a security measure to protect your account</li>
          <li>No action is required from your end</li>
        </ul>
      </div>
      
      <div class="divider">
        <p><strong>Didn't attempt to log in?</strong></p>
        <p>If you didn't try to access your account, someone may be attempting unauthorized access. Please contact our support team immediately to secure your account.</p>
      </div>
      
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" class="button">Contact Support</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Kenya Bizz Directory. All rights reserved.</p>
      <div class="footer-links">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}">Visit Website</a>
        <span style="color: #efefef;">|</span>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact">Contact Support</a>
      </div>
    </div>
  `

  const html = getEmailTemplate(content, 'Account Temporarily Locked - Kenya Bizz Directory')

  return sendEmail({
    to: email,
    subject: 'Account Temporarily Locked - Kenya Bizz Directory',
    html,
  })
}