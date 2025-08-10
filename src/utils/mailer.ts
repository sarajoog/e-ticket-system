import nodemailer from 'nodemailer'

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      // Correct transport options structure
      host: process.env.MAILTRAP_SMTP_HOST,
      port: parseInt(process.env.MAILTRAP_SMTP_PORT || '2525'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    } as nodemailer.TransportOptions)

    const info = await transporter.sendMail({
      from: '"Inngest TMS" <no-reply@example.com>',
      to,
      subject,
      text,
    })

    console.log('Message sent:', info.messageId)
    return info
  } catch (error) {
    throw error
  }
}
