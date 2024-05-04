import Joi from 'joi'

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
]

export const envSchema = Joi.object()
  .keys({
    ALGORITHM: Joi.string()
      .required()
      .uppercase()
      .valid(...alghorithms),
    JWT_EXPIRES_IN: Joi.string()
      .required()
      .pattern(/^[0-9]+[smhdw]$/),
    JWT_SECRET: Joi.string().required(),
    MONGODB_URI: Joi.string().required().uri(),
    SALT_LENGTH: Joi.number().required().integer().min(4).max(64),
  })
  .unknown()
