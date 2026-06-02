// server/envConfig.js
// Load environment variables and validate them using Zod.

import { config } from 'dotenv';
import { z } from 'zod';

// Load .env (if present). In production, env vars are usually set in the environment.
config();

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GMAIL_USER: z.string().email(),
  GMAIL_APP_PASSWORD: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(5001),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
