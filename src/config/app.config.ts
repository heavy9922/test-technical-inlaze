export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  dbHost: process.env.DB_HOST,
  pgDb: process.env.POSTGRES_DB,
  pgUser: process.env.POSTGRES_USER,
  pgPasswd: process.env.POSTGRES_PASSWORD,
  pgPort: process.env.PG_PORT,
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  redisUri: process.env.REDIS_URI,
  redisPort: process.env.REDIS_PORT,
  redisEnabed: process.env.REDIS,
  hostApi: process.env.HOST_API,
  mailKeyApi:process.env.MAILJET_API_KEY,
  mailKeySecret:process.env.MAILJET_API_SECRET,
  mail:process.env.MAILJET_SENDER_EMAIL
});
