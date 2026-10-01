import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.conf.js';

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const accessDecrypt = jwt.verify(accessToken, jwtConfig.accessSecret!);

    req.user = accessDecrypt;

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired access token',
    });
  }
};
