import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { smtpConfig } from '../config/smtp.conf.js';
import { Email } from '../types/email.types.js';

export async function sendEmail(email: Email) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  });

  await transporter.verify();

  const info = await transporter.sendMail({
    from: smtpConfig.user,
    to: email.receiver,
    subject: email.subject,
    html: email.body,
  });

  console.log('Message sent: %s', info.messageId);
}

export function signEmail(email: string): string {
  return jwt.sign(
    {
      email: email,
    },
    smtpConfig.validationSecret!,
    {
      expiresIn: `${smtpConfig.validationTTL}m`,
    },
  );
}

export function verifyEmail(token: string) {
  return jwt.verify(token, smtpConfig.validationSecret!);
}
