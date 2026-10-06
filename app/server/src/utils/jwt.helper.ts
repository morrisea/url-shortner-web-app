import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.conf.js';
import { AuthToken } from '../types/auth.types.js';

export const sign = (user: AuthToken, type: string) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      first: user.first,
      last: user.last,
    },
    type == 'access' ? jwtConfig.accessSecret! : jwtConfig.refreshSecret!,
    {
      expiresIn:
        type === 'access'
          ? `${jwtConfig.accessTTL}m`
          : `${jwtConfig.refreshTTL}d`,
    },
  );
};

export const verify = (token: string, type: string) => {
  return jwt.verify(
    token,
    type == 'access' ? jwtConfig.accessSecret! : jwtConfig.refreshSecret!,
  );
};
