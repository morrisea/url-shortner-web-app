import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { multiFactor, users } from '../database/schema.js';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.conf.js';

export const verifyMFA = async (req: Request, res: Response) => {
  const { code, email } = req.body || {};

  try {
    const [activeCode] = await db
      .select()
      .from(multiFactor)
      .where(and(eq(multiFactor.code, code), eq(multiFactor.email, email)));

    if (
      !activeCode ||
      new Date() > activeCode.expiresAt ||
      activeCode.code !== code
    ) {
      return res.status(401).json({
        message: 'This verification code is invalid or has already been used.',
      });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    await db
      .delete(multiFactor)
      .where(and(eq(multiFactor.code, code), eq(multiFactor.email, email)));

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
