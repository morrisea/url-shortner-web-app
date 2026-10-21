import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';

export const deleteLink = (req: Request, res: Response) => {
  return res.status(200).json({
    user: req.user,
  });
};
