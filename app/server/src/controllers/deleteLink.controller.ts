import { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { savedURLs } from '../database/schema.js';
import { AuthToken } from '../types/auth.types.js';

export const deleteLink = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req.user as AuthToken).id;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid link ID' });
  }

  try {
    await db
      .delete(savedURLs)
      .where(and(eq(savedURLs.userId, userId), eq(savedURLs.urlId, id)));

    return res.status(200).json({
      message: 'Saved URL removed successfully',
    });
  } catch (error) {
    console.error('Error deleting saved URL:', error);

    return res.status(500).json({
      message: 'Failed to remove saved URL',
    });
  }
};
