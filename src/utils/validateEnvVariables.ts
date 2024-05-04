import { envSchema } from '../schemas/env.schema';

/**
 * Validates the environment variables against the provided schema.
 *
 * @return {Number} - Throws an error if the environment variables are invalid.
 */
export function validateEnvVariables() {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  Object.keys(envSchema.describe().keys).forEach((key) => {
    process.env[key] = value[key];
  });
}
