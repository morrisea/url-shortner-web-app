import { Request, Response } from 'express';
import { LoginRequestBody, LoginResponseBody } from '../types/auth.types.js';

import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { users } from '../database/schema.js';
import { compare } from '../utils/bcrypt.helper.js';

import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.conf.js';

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

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtConfig.refreshSecret!,
      { expiresIn: `${jwtConfig.refreshTTL}d` },
    );

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtConfig.accessSecret!,
      { expiresIn: `${jwtConfig.accessTTL}m` },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(jwtConfig.refreshTTL) * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'User authenticated',
      accessToken,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
