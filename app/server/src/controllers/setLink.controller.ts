import type { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { urls, savedURLs } from '../database/schema.js';
import { generateHash, generateRedirectPath } from '../utils/crypto.helper.js';
import { AuthToken } from '../types/auth.types.js';

export async function setLink(req: Request, res: Response) {
  try {
    const { address } = req.body;

    if (typeof address !== 'string' || !address.trim()) {
      return res.status(400).json({ error: 'Address is required.' });
    }

    let parsedURL: URL;

    try {
      parsedURL = new URL(address.trim());
    } catch {
      return res.status(400).json({ error: 'Invalid URL.' });
    }

    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      return res.status(400).json({
        error: 'Only HTTP and HTTPS URLs are supported.',
      });
    }

    const normalizedAddress = address.trim();
    const addressHash = generateHash(normalizedAddress);

    let [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.addressHash, addressHash))
      .limit(1);

    if (!url) {
      const redirect = generateRedirectPath();

      const res = await db.insert(urls).values({
        address: normalizedAddress,
        addressHash,
        redirect,
      });

      const [shortURL] = await db
        .select()
        .from(urls)
        .where(eq(urls.id, Number(res[0].insertId)))
        .limit(1);

      url = shortURL;
    }

    if (!url) {
      return res.status(500).json({ error: 'Unable to create URL.' });
    }

    const user = req.user as AuthToken;

    if (user) {
      const [saved] = await db
        .select()
        .from(savedURLs)
        .where(and(eq(savedURLs.userId, user.id), eq(savedURLs.urlId, url.id)))
        .limit(1);

      if (!saved) {
        await db.insert(savedURLs).values({
          userId: user.id,
          urlId: url.id,
        });
      }
    }

    return res.status(201).json({
      message: 'URL created successfully.',
      url: {
        id: url.id,
        address: url.address,
        redirect: url.redirect,
      },
    });
  } catch (error) {
    console.error('setLink error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
