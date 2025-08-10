import { db } from '@/lib/db/firebaseAdmin'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'
import { sendMail } from '@/utils/mailer'

export async function POST(req: NextRequest) {
  let evt

  try {
    // ✅ Always verify webhook
    evt = await verifyWebhook(req)
  } catch (err) {
    console.error('Webhook verification failed:', err)
    // ✅ Return 200 OK so Clerk won't retry endlessly
    return new NextResponse('Ignored invalid webhook', { status: 200 })
  }

  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook received: ${eventType} (ID: ${id})`)

  try {
    if (eventType === 'user.created') {
      const user = evt.data

      const userData = {
        clerkId: user.id,
        email: user.email_addresses?.[0]?.email_address || null,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        createdAt: new Date().toISOString(),
      }

      console.log('📦 Saving new user to Firestore:', userData)

      // ✅ Make Firestore write non-blocking
      await db.collection('users').doc(user.id).set(userData)

      // ✅ Trigger Inngest function
      /*
      await inngest.send({
        name: 'user/signup',
        data: userData.email,
      })
      */
      const subject = 'Welcome to E-Ticket System!'
      const message = `Hi 
                 \n\n
                 Thanks for signing up. We are happy to have you onboard!
               `
      if (userData.email) {
        await sendMail(userData.email, subject, message)
      }
      console.log('✅ User saved to Firestore and Inngest function triggered')
    }
  } catch (err) {
    console.error(`Failed processing event ${eventType}:`, err)
    // ✅ Still return 200 so Clerk doesn’t retry
    return new NextResponse('Processed with errors', { status: 500 })
  }

  return new NextResponse('✅ Webhook processed', { status: 200 })
}
