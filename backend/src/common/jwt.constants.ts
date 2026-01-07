export const jwtConstants = {
  secret: process.env.JWT_SECRET || "secret",
  expiresIn: process.env.JWT_EXPIRES_IN ,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ,
};