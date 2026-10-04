import crypto from 'crypto';

export function generateCode(): string {
  return crypto.randomBytes(4).toString('hex');
}
