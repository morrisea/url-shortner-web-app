import type { Request, Response } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { savedURLs } from '../database/schema.js';
import { AuthToken } from '../types/auth.types.js';

export async function updateLink(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { redirect } = req.body;
    const user = req.user as AuthToken;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid URL ID.',
      });
    }

    if (typeof redirect !== 'string' || !redirect.trim()) {
      return res.status(400).json({
        error: 'Redirect is required.',
      });
    }

    const normalizedRedirect = redirect.trim();

    if (
      normalizedRedirect.length > 16 ||
      !/^[a-zA-Z0-9_-]+$/.test(normalizedRedirect)
    ) {
      return res.status(400).json({
        error:
          'Redirect must be at most 16 alphanumeric characters, hyphens, or underscores.',
      });
    }

    const [saved] = await db
      .select()
      .from(savedURLs)
      .where(and(eq(savedURLs.urlId, id), eq(savedURLs.userId, user.id)))
      .limit(1);

    if (!saved) {
      return res.status(404).json({
        error: 'Saved URL not found.',
      });
    }

    await db
      .update(savedURLs)
      .set({ redirect: normalizedRedirect })
      .where(and(eq(savedURLs.urlId, id), eq(savedURLs.userId, user.id)));

    return res.status(200).json({
      message: 'Redirect updated successfully.',
      url: {
        id: saved.urlId,
        redirect: normalizedRedirect,
      },
    });
  } catch (error) {
    console.error('updateLink error:', error);

    return res.status(500).json({
      error: 'Internal server error.',
    });
  }
}
