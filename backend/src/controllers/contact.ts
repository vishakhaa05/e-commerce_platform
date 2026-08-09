import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../utils/email.js';

export const submitContactForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const emailSubject = `New Contact Inquiry: ${subject}`;
    const emailText = `
You have received a new contact inquiry.

Details:
Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}
    `;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px;">
        <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #10b981; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold;">Message:</p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Send the email to vishakhaagrawal0508@gmail.com
    await sendEmail({
      email: 'vishakhaagrawal0508@gmail.com',
      subject: emailSubject,
      message: emailText,
      html: emailHtml,
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! Your message has been sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};
