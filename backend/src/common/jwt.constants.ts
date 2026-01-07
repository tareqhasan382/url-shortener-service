export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secret', //|| 'secret'
  expiresIn: process.env.JWT_EXPIRES_IN || '15m', //|| '15m'
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', //|| '7d'
};