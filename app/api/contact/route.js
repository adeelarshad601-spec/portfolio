import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

const generateAdminEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Portfolio Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond directly to the sender.</p>
    </div>
  </div>
`;

const generateUserAutoReplyTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #16f2b3;">Thank You for Reaching Out!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for contacting me through my portfolio. I have received your message and will get back to you as soon as possible.</p>
      <br />
      <p>Best regards,</p>
      <p><strong>Adeel Arshad</strong><br />Web Developer</p>
    </div>
  </div>
`;

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    if (!name || !email || !userMessage) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required.',
      }, { status: 400 });
    }

    const adminMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_ADDRESS}>`, 
      to: process.env.EMAIL_ADDRESS, 
      subject: `New Message From ${name}`, 
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${userMessage}`, 
      html: generateAdminEmailTemplate(name, email, userMessage), 
      replyTo: email, 
    };

    const userMailOptions = {
      from: `"Adeel Arshad" <${process.env.EMAIL_ADDRESS}>`, 
      to: email, 
      subject: `Thanks for reaching out, ${name}!`, 
      html: generateUserAutoReplyTemplate(name), 
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Email and Auto-reply sent successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error occurred.',
    }, { status: 500 });
  }
}