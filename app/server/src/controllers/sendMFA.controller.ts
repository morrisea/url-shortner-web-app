import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../database/mysql.database.js';
import { multiFactor } from '../database/schema.js';
import { sendEmail } from '../utils/nodemailer.helper.js';
import { generateCode } from '../utils/crypto.helper.js';
import { mfaConfig } from '../config/mfa.conf.js';

export const sendMFA = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  try {
    const [activeCode] = await db
      .select()
      .from(multiFactor)
      .where(eq(multiFactor.email, email));

    if (activeCode) {
      await db.delete(multiFactor).where(eq(multiFactor.email, email));
    }

    const code = generateCode();

    await db.insert(multiFactor).values({
      email,
      code,
      expiresAt: new Date(Date.now() + mfaConfig.codeTTL * 60 * 1000),
    });

    await sendEmail({
      receiver: email,
      subject: 'ShortURL MFA Code',
      body: code,
    });

    return res.status(201).json({
      message: '2FA email sent',
      email: email,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
