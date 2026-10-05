import { Request, Response } from 'express';
import {
  RegisterRequestBody,
  RegisterResponseBody,
} from '../types/auth.types.js';
import { eq } from 'drizzle-orm';
import { users } from '../database/schema.js';
import { db } from '../database/mysql.database.js';
import { hash } from '../utils/bcrypt.helper.js';
import { sendEmail, signEmail } from '../utils/nodemailer.helper.js';
import { smtpConfig } from '../config/smtp.conf.js';

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response<RegisterResponseBody>,
) => {
  const { firstName, lastName, email, password, confirmPassword } =
    req.body || {};
  const isValidPassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  try {
    if (
      [firstName, lastName, email, password, confirmPassword].some(
        (value) => !value,
      )
    ) {
      return res.status(422).json({
        message: 'All fields are required',
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        message: 'Password must match password confirmation field',
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Email is already registered',
      });
    }

    if (!isValidPassword(password)) {
      return res.status(422).json({
        message: 'Password does not fulfill password requirements',
      });
    }

    const passwordHash = await hash(password);

    const token = signEmail(email);
    const body = `${smtpConfig.api}/verify-email/?token=${token}`;

    await sendEmail({
      receiver: email,
      subject: 'ShortURL Email Verification Code',
      body: body,
    });

    await db.insert(users).values({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email,
      passwordHash: passwordHash,
      isEmailVerified: false,
    });

    return res.status(201).json({
      message: 'Registration successful',
      email: email,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
