import { NonRetriableError } from 'inngest'
import { inngest } from '../client'
import { db } from '@lib/db/firebaseAdmin'
import { sendMail } from '@/utils/mailer'

export const onUserSignup = inngest.createFunction(
  { id: 'on-user-signup', name: 'user/signup', retries: 3 }, // Function ID
  { event: 'user/signup' }, // Trigger on user/signup event
  async ({ event, step }) => {
    try {
      const { email } = event.data

      await step.run('Process Signup', async () => {
        // Check if the user already exists
        const userDoc = await db.collection('users').doc(email).get()
        if (!userDoc.exists) {
          console.log(`User does not exist: ${email}`)
          throw new NonRetriableError('User does not exist in Database')
        }
      })

      await step.run('Send Welcome Email', async () => {
        const subject = 'Welcome to E-Ticket System!'
        const message = `Hi 
            \n\n
            Thanks for signing up. We are happy to have you onboard!
          `
        await sendMail(email, subject, message)
      })
      console.log(`User signup processed for: ${email}`)
      return { success: true }
    } catch (error) {
      console.error('Error processing user signup:', error)
    }
  }
)
