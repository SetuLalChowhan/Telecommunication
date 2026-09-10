import nodemailer from 'nodemailer';

const emailPort = Number(process.env.EMAIL_PORT) || 587;
const isSecure =
  process.env.EMAIL_SECURE !== undefined
    ? process.env.EMAIL_SECURE === 'true'
    : emailPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: isSecure,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  await transporter.sendMail({
    from: `"Nest Auth API" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}