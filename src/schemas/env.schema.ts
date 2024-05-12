import Joi from 'joi';

const alghorithms = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
];

export const envSchema = Joi.object()
  .keys({
    ALGORITHM: Joi.string()
      .uppercase()
      .valid(...alghorithms)
      .default('HS256'),
    JWT_ACCESS_EXPIRES_IN: Joi.string()
      .pattern(/^[0-9]+[smhdw]$/)
      .default('10m'),
    JWT_ACCESS_SECRET: Joi.string().required().min(16).max(64),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
      .pattern(/^[0-9]+[smhdw]$/)
      .default('90d'),
    JWT_REFRESH_SECRET: Joi.string().required().min(16).max(64),
    MONGODB_URI: Joi.string().required().uri(),
    SALT_LENGTH: Joi.number().integer().min(4).max(64).default(16),
  })
  .unknown();
