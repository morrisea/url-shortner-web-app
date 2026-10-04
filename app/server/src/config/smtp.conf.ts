export const smtpConfig = {
  user: process.env.SMTP_EMAIL,
  password: process.env.SMTP_PASS,
  validationSecret: process.env.SMTP_VALIDATION_SECRET,
  validationTTL: Number(process.env.SMTP_VALIDATION_TTL),
  api: process.env.API_URL,
  url: process.env.FRONTEND_URL,
};
