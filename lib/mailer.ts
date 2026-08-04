import nodemailer from 'nodemailer';

// Create a generic transporter. 
// In development, you might want to use ethereal email or console log if no SMTP is provided.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Cherrywood Admin" <noreply@cherrywood.com>',
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for the Cherrywood Admin Panel.</p>
        <p>Please click the button below to set a new password. This link will expire in 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    if (!process.env.SMTP_USER) {
      // If using ethereal email without real credentials, log the preview URL
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    // Depending on the environment, we might just log this to avoid crashing
  }
};

export const sendInquiryEmail = async (inquiry: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message?: string | null;
}) => {
  // 1. Get interest readable label
  const getInterestLabel = (interest: string) => {
    switch (interest) {
      case 'type-a': return 'Type A — 3 Bedrooms';
      case 'type-b': return 'Type B — 2 Bedrooms + Drawing';
      case 'type-c': return 'Type C — 2 Bedrooms';
      case 'shop': return 'Ground Floor Retail Shop';
      case 'other': return 'General Enquiry';
      default: return interest || 'General Enquiry';
    }
  };

  const interestLabel = getInterestLabel(inquiry.interest);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const adminPanelLink = `${appUrl}/admin/n8_nwrr2675/inquiries`;

  // 2. Draft User Confirmation Email (Rich modern design)
  const userMailOptions = {
    from: process.env.SMTP_FROM || '"Cherrywood Builders" <info@cherrywoodbuilders.com>',
    to: inquiry.email,
    subject: 'We have received your enquiry - Cherrywood',
    html: `
      <div style="font-family: 'Outfit', 'Inter', sans-serif; background-color: #0b1523; color: #ffffff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1a2d44;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #c9a84c; font-size: 28px; font-weight: 300; letter-spacing: 0.1em; margin: 0; text-transform: uppercase;">Cherrywood</h1>
          <p style="color: #64748b; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; text-transform: uppercase; margin: 5px 0 0 0;">Prestige & Luxury Living</p>
        </div>
        
        <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 400; margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Dear ${inquiry.name},</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering your interest in <strong>Cherrywood</strong>. We have successfully received your enquiry, and our dedicated concierge team is currently reviewing your preferences.
          </p>
          
          <h3 style="color: #c9a84c; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 25px;">Your Enquiry Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px;">Interested In:</td>
              <td style="padding: 8px 0; color: #ffffff; font-size: 13px; font-weight: bold;">${interestLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Phone Number:</td>
              <td style="padding: 8px 0; color: #ffffff; font-size: 13px;">${inquiry.phone}</td>
            </tr>
            ${inquiry.message ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; vertical-align: top;">Your Message:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-size: 13px; font-style: italic;">"${inquiry.message}"</td>
            </tr>` : ''}
          </table>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
          A relationship manager will get in touch with you shortly to walk you through the options, pricing, and payment structures.
        </p>
        
        <div style="text-align: center; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
          <p style="color: #64748b; font-size: 11px; margin: 0;">Cherrywood Builders & Developers</p>
          <p style="color: #475569; font-size: 10px; margin-top: 5px;">This is an automated confirmation of your contact form submission.</p>
        </div>
      </div>
    `,
  };

  // 3. Draft Admin Notification Email
  const adminMailOptions = {
    from: process.env.SMTP_FROM || '"Cherrywood Portal" <info@cherrywoodbuilders.com>',
    to: '', // Will resolve programmatically
    subject: `🚨 New Inquiry: ${inquiry.name} - ${interestLabel}`,
    html: `
      <div style="font-family: sans-serif; background-color: #f8fafc; color: #0f172a; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px;">
          <span style="background-color: #dbeafe; color: #1e40af; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.05em;">New Inquiry</span>
          <h1 style="font-size: 22px; font-weight: bold; color: #1e293b; margin: 10px 0 0 0;">Inquiry Details</h1>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-size: 14px; width: 140px;">Name</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${inquiry.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${inquiry.email}" style="color: #3b82f6; text-decoration: none;">${inquiry.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-size: 14px;">Phone</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 14px;"><a href="tel:${inquiry.phone}" style="color: #3b82f6; text-decoration: none;">${inquiry.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-size: 14px;">Interest Type</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${interestLabel}</td>
          </tr>
          ${inquiry.message ? `
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; font-size: 14px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; color: #334155; font-size: 14px; line-height: 1.5; background-color: #f1f5f9; padding: 12px; border-radius: 6px; margin-top: 5px; display: block;">${inquiry.message}</td>
          </tr>` : ''}
        </table>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${adminPanelLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold; display: inline-block;">Manage in Admin Panel</a>
        </div>
        
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          Cherrywood Admin System • Auto-generated Notification
        </p>
      </div>
    `,
  };

  try {
    // A. Send confirmation email to user
    await transporter.sendMail(userMailOptions);
    console.log('Confirmation email sent to user:', inquiry.email);

    // B. Query admin emails from DB
    let adminEmails: string[] = [];
    try {
      const { prisma } = await import('@/lib/prisma');
      const adminUsers = await prisma.user.findMany({
        where: {
          role: {
            name: {
              equals: 'admin',
            },
          },
        },
        select: { email: true },
      });
      adminEmails = adminUsers.map((u) => u.email).filter(Boolean);
    } catch (dbError) {
      console.error('Error fetching admin emails from DB:', dbError);
    }

    // Fallback if no admin users in DB, use SMTP_USER or a default
    if (adminEmails.length === 0) {
      if (process.env.SMTP_USER) {
        adminEmails.push(process.env.SMTP_USER);
      } else {
        adminEmails.push('info@cherrywoodbuilders.com');
      }
    }

    // Send notification email to admin(s)
    adminMailOptions.to = adminEmails.join(', ');
    await transporter.sendMail(adminMailOptions);
    console.log('Admin notification email sent to:', adminMailOptions.to);
  } catch (error) {
    console.error('Error in sendInquiryEmail helper:', error);
  }
};
