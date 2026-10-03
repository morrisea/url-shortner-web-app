import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import jwt from 'jsonwebtoken';
import { smtpConfig } from '../config/smtp.conf.js';
import { VerifyEmailParams } from '../types/email.types.js';
import { users } from '../database/schema.js';

export const verify = async (
  req: Request<{}, {}, {}, VerifyEmailParams>,
  res: Response,
) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: 'Verification token is required',
    });
  }

  try {
    const decrypted = jwt.verify(token, smtpConfig.validationSecret!);
    console.log(token);

    if (typeof decrypted === 'string' || !decrypted.email) {
      return res.status(401).json({
        message: 'Invalid verification token',
      });
    }

    const email = decrypted.email;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({
        message: 'Invalid verification token',
      });
    }

    await db
      .update(users)
      .set({
        isEmailVerified: true,
      })
      .where(eq(users.email, email));

    return res.redirect('http://localhost:5173/login');
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
