import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { multiFactor, users } from '../database/schema.js';
import { sign } from '../utils/jwt.helper.js';
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
    const tokenData = {
      id: user.id,
      email: user.email,
      first: user.firstName,
      last: user.lastName,
    };

    await db
      .delete(multiFactor)
      .where(and(eq(multiFactor.code, code), eq(multiFactor.email, email)));

    const refreshToken = sign(tokenData, 'refresh');

    const accessToken = sign(tokenData, 'access');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
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
