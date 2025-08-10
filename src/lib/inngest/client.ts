import { Inngest } from 'inngest'

// Create and export the Inngest client
export const inngest = new Inngest({
  id: 'e-ticket-system',
  eventKey:
    'signkey-prod-2c594f895049eb276a7a9f18178961c57b8a741bb9ae37dbc666c0f4f77305d1', // From Inngest dashboard
})
