import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().optional().default(3333),
  MONGO_URL: z.url(),
  JWT_SECRET: z.string().min(6),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", z.prettifyError(_env.error));

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
