import { Request, Response } from 'express';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { savedURLs } from '../database/schema.js';
import { AuthToken } from '../types/auth.types.js';

export const deleteManyLinks = async (req: Request, res: Response) => {
  const ids: number[] = req.body.ids;
  const userId = (req.user as AuthToken).id;

  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every((id) => Number.isInteger(id) && id > 0)
  ) {
    return res.status(400).json({ message: 'Invalid link IDs' });
  }

  try {
    await db
      .delete(savedURLs)
      .where(and(eq(savedURLs.userId, userId), inArray(savedURLs.urlId, ids)));

    return res.status(200).json({
      message: 'Saved URLs removed successfully',
    });
  } catch (error) {
    console.error('Error deleting saved URLs:', error);

    return res.status(500).json({
      message: 'Failed to remove saved URLs',
    });
  }
};
