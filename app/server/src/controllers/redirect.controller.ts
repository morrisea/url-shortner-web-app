import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { savedURLs, urls } from '../database/schema.js';

export async function redirectLink(req: Request, res: Response) {
  try {
    const { redirect } = req.params;

    if (!redirect || typeof redirect !== 'string') {
      return res.status(400).json({
        error: 'Redirect path is required.',
      });
    }

    const [result] = await db
      .select({
        address: urls.address,
      })
      .from(savedURLs)
      .innerJoin(urls, eq(savedURLs.urlId, urls.id))
      .where(eq(savedURLs.redirect, redirect))
      .limit(1);

    if (!result) {
      return res.status(404).json({
        error: 'Short URL not found.',
      });
    }

    return res.redirect(302, result.address);
  } catch (error) {
    console.error('redirectLink error:', error);

    return res.status(500).json({
      error: 'Internal server error.',
    });
  }
}
