import { Request, Response } from 'express';
import { LoginRequestBody, LoginResponseBody } from '../types/auth.types.js';

import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { users, multiFactor } from '../database/schema.js';
import { compare } from '../utils/bcrypt.helper.js';

import { generateCode } from '../utils/crypto.helper.js';
import { sendEmail } from '../utils/nodemailer.helper.js';
import { mfaConfig } from '../config/mfa.conf.js';

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<LoginResponseBody>,
) => {
  const { email, password } = req.body || {};

  try {
    if ([email, password].some((value) => !value)) {
      return res.status(422).json({
        message: 'All fields are required',
      });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isValidUser = await compare(password, user['passwordHash']);

    if (!isValidUser) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'User email is not validated',
        email: user.email,
      });
    }

    const code = generateCode();

    await db.delete(multiFactor).where(eq(multiFactor.email, email));

    await db.insert(multiFactor).values({
      email: user.email,
      code,
      expiresAt: new Date(Date.now() + mfaConfig.codeTTL * 60 * 1000),
    });

    await sendEmail({
      receiver: user.email,
      subject: 'ShortURL MFA Code',
      body: code,
    });

    return res.status(200).json({
      message: 'MFA required',
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
