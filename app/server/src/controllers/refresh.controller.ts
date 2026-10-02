import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.conf.js';

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  try {
    const refreshDecrypt = jwt.verify(
      refreshToken,
      jwtConfig.refreshSecret!,
    ) as jwt.JwtPayload;

    const newAccessToken = jwt.sign(
      {
        userId: refreshDecrypt.userId,
        email: refreshDecrypt.email,
      },
      jwtConfig.accessSecret!,
      {
        expiresIn: `${jwtConfig.accessTTL}m`,
      },
    );

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired refresh token',
    });
  }
};
