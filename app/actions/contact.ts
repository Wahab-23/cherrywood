'use server'

import { prisma } from '@/lib/prisma'
import { sendInquiryEmail } from '@/lib/mailer'

export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get('first') as string
    const lastName = formData.get('last') as string
    const name = `${firstName} ${lastName}`.trim()
    
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const interest = formData.get('interest') as string
    const userMessage = formData.get('message') as string

    if (!name || !email || !phone) {
      return { success: false, error: 'Name, email, and phone are required.' }
    }

    await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        interest,
        message: userMessage,
        status: 'new'
      }
    })

    // Send email notifications asynchronously without blocking the user response
    sendInquiryEmail({
      name,
      email,
      phone,
      interest,
      message: userMessage
    }).catch(err => {
      console.error('Error sending inquiry emails in background:', err)
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to submit form', error)
    return { success: false, error: 'Failed to submit the form. Please try again.' }
  }
}
