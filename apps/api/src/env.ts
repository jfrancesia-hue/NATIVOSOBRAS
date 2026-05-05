import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  API_PORT: z.coerce.number().default(4000),
  API_CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:8081"),
  MAX_AVANCE_DISTANCE_METERS: z.coerce.number().positive().default(500),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export const env = schema.parse(process.env);

export const corsOrigins = env.API_CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
