import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  PG_PORT: Joi.number().default(5432).required(),
  PORT: Joi.number().default(3005).required(),
  JWT_SECRET: Joi.string().required(),
  REDIS_URI: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379).required(),
  REDIS: Joi.boolean().default(false).required(),
  HOST_API: Joi.string().required(),
  MAILJET_API_KEY: Joi.string().required(),
  MAILJET_API_SECRET: Joi.string().required(),
  MAILJET_SENDER_EMAIL: Joi.string().required(),
});
