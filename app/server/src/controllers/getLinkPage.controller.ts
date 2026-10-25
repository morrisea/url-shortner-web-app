import { Request, Response } from 'express';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { urls, savedURLs } from '../database/schema.js';
import type { AuthToken } from '../types/auth.types.js';

export const getLinkPage = async (req: Request, res: Response) => {
  const userId = (req.user as AuthToken).id;

  const page = Number(req.query.page ?? 0);
  const pageSize = Number(req.query.pageSize ?? 5);

  if (
    !Number.isInteger(page) ||
    page < 0 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 25
  ) {
    return res.status(400).json({
      message: 'Invalid pagination parameters',
    });
  }

  try {
    const rows = await db
      .select({
        id: urls.id,
        address: urls.address,
        redirect: savedURLs.redirect,
        creationDate: savedURLs.creationDate,
      })
      .from(savedURLs)
      .innerJoin(urls, eq(savedURLs.urlId, urls.id))
      .where(eq(savedURLs.userId, userId))
      .orderBy(desc(savedURLs.creationDate))
      .limit(pageSize)
      .offset(page * pageSize);

    const [{ total }] = await db
      .select({ total: count() })
      .from(savedURLs)
      .where(eq(savedURLs.userId, userId));

    return res.status(200).json({
      rows,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Failed to retrieve saved URLs:', error);

    return res.status(500).json({
      message: 'Failed to retrieve saved URLs',
    });
  }
};
