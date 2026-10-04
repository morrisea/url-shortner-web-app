import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { users } from '../database/schema.js';
import { db } from '../database/mysql.database.js';
import { sendEmail, genValidationToken } from '../utils/nodemailer.helper.js';
import { smtpConfig } from '../config/smtp.conf.js';

export const resend = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || user.isEmailVerified) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const token = genValidationToken(email);
    const body = `${smtpConfig.api}/verify-email/?token=${token}`;

    await sendEmail({
      receiver: email,
      subject: 'ShortURL Email Verification Code',
      body: body,
    });

    return res.status(201).json({
      message: 'Verification email resent',
      email: email,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
