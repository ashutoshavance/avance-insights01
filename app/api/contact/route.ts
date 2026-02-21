import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, organization, service, message, honeypot } = body

    // Spam check - honeypot field should be empty
    if (honeypot) {
      return NextResponse.json({ success: true }) // Silently reject spam
    }

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Compose email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #d946ef); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Organization:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${organization || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">Service Interest:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${service}</td>
            </tr>
          </table>
          
          <h3 style="color: #1e293b; margin-top: 20px;">Message</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="color: #475569; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              <strong>Reply directly</strong> to this email to respond to the inquiry.
            </p>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p>This email was sent from the Avance Insights website contact form.</p>
        </div>
      </div>
    `

    // Compose acknowledgment email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #d946ef); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <p style="color: #1e293b; font-size: 16px;">Dear ${name},</p>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for reaching out to Avance Insights. We have received your inquiry about 
            <strong>${service}</strong> and our team will review it shortly.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            You can expect a response within <strong>24 business hours</strong>. In the meantime, 
            feel free to explore our website to learn more about our services and capabilities.
          </p>
          
          <div style="margin: 25px 0; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; margin-top: 0;">Your Message</h3>
            <p style="color: #64748b; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #475569; line-height: 1.6;">
            If you have any urgent questions, please don't hesitate to call us at 
            <a href="tel:+919999999999" style="color: #2563eb;">+91 99999 99999</a>.
          </p>
          
          <p style="color: #1e293b; margin-top: 25px;">
            Best regards,<br>
            <strong>The Avance Insights Team</strong>
          </p>
        </div>
        <div style="padding: 20px; text-align: center; background: #1e293b; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">Avance Insights | Market Research & Brand Solutions</p>
          <p style="margin: 5px 0;">New Delhi, India | info@avanceinsights.in</p>
        </div>
      </div>
    `

    // Send email to admin
    await transporter.sendMail({
      from: `"Avance Insights Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'manoj@avanceinsights.in',
      replyTo: email,
      subject: `New Inquiry: ${service} - ${name}`,
      html: adminEmailHtml,
    })

    // Send acknowledgment email to user
    await transporter.sendMail({
      from: `"Avance Insights" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting Avance Insights',
      html: userEmailHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
