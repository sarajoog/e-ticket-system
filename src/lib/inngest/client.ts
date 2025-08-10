import { Inngest } from 'inngest'

// Create and export the Inngest client
export const inngest = new Inngest({
  id: 'e-ticket-system',
  eventKey: process.env.INNGEST_SIGNING_KEY,
})
