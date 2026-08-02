import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../utils/email.js';

export const submitContactForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400).json({ success: false, message: 'All fields are required.' });
      return;
    }

    const emailSubject = `New Contact Us Inquiry from ${name}`;
    const emailText = `
You have received a new contact inquiry.

Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message:
${message}
    `;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px;">
        <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
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
      message: 'Your inquiry has been sent successfully. Thank you!',
    });
  } catch (error) {
    next(error);
  }
};
