import { Request, Response } from 'express';
import { sign, verify } from '../utils/jwt.helper.js';
import { AuthToken } from '../types/auth.types.js';

export const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  try {
    const user = verify(refreshToken, 'refresh') as AuthToken;
    const newAccessToken = sign(user, 'access');

    return res.status(200).json({
      token: newAccessToken,
    });
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired refresh token',
    });
  }
};
