import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwt.helper.js';
import { AuthToken } from '../types/auth.types.js';

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    req.user = verify(accessToken, 'access') as AuthToken;

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired access token',
    });
  }
};
