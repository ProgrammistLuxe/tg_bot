export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT) || 3000,
  MODE: process.env.MODE,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET,
  TG_BOT_KEY: process.env.TG_BOT_KEY,
});
