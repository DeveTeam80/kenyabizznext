// scripts/check-resend.ts
import 'dotenv/config' // 🔥 Add this line at the very top
import { sendVerificationEmail } from '../src/app/lib/email'

async function main() {
  console.log('🧪 Testing Resend Email Service...\n')

  // 🔥 Debug: Check if env vars are loaded
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment!')
    console.log('\n📋 Checklist:')
    console.log('   1. Create .env file in project root')
    console.log('   2. Add: RESEND_API_KEY="re_your_key_here"')
    console.log('   3. Get API key from: https://resend.com/api-keys')
    process.exit(1)
  }

  console.log('✅ RESEND_API_KEY loaded')
  console.log(`   Key preview: ${process.env.RESEND_API_KEY.substring(0, 10)}...`)

  const testEmail = process.argv[2] || 'your-email@gmail.com'

  if (testEmail === 'your-email@gmail.com') {
    console.error('\n❌ Please provide your email as argument:')
    console.log('   npx tsx scripts/check-resend.ts your-email@gmail.com')
    process.exit(1)
  }

  console.log(`\n📧 Sending test email to: ${testEmail}\n`)

  const result = await sendVerificationEmail(testEmail, 'test-token-123456')

  if (result.success) {
    console.log('✅ Email sent successfully!')
    console.log(`   Email ID: ${result.data?.id}`)
    console.log('\n📬 Check your inbox (and spam folder)!')
    console.log('\n💡 View email logs: https://resend.com/emails')
  } else {
    console.error('❌ Failed to send email')
    console.error('Error:', result.error)
    console.log('\n📋 Troubleshooting:')
    console.log('   - Verify API key at: https://resend.com/api-keys')
    console.log('   - Check API key has sending permissions')
    console.log('   - View logs: https://resend.com/emails')
  }
}

main().catch(console.error)