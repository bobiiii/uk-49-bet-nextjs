import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { fullname, email, category, subject, message } = await req.json();

    if (!fullname || !email || !category || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${fullname}" <${email}>`,
      to: 'aloracarl@gmail.com',
      subject: `📬 Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
          <h2 style="color: #2d7ff9; margin-bottom: 16px;">New Contact Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Fullname:</td>
              <td style="padding: 8px;">${fullname}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Category:</td>
              <td style="padding: 8px;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
          </table>
          <div style="background: #fff; padding: 16px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <p style="font-weight: bold; color: #2d7ff9; margin-bottom: 8px;">Message:</p>
            <p style="color: #333; margin: 0;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ status: "Success", message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
