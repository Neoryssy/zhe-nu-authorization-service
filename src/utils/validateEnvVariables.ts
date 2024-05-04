import { envSchema } from '../schemas/env.schema';

export function validateEnvVariables() {
  const { error } = envSchema.validate(process.env);

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }
}
