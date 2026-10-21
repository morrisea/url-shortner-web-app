import crypto from 'crypto';

export function generateCode(): string {
  return crypto.randomBytes(4).toString('hex');
}

export function generateHash(address: string) {
  return crypto.createHash('sha256').update(address).digest('hex');
}

export function generateRedirectPath() {
  return crypto.randomBytes(8).toString('base64url');
}
