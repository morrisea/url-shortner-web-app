export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTTL: Number(process.env.JWT_ACCESS_TTL),
  refreshTTL: Number(process.env.JWT_REFRESH_TTL),
};
