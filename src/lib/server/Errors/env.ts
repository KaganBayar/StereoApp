import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH: z.string(),
  // Add others...
});

export const ENV = (() => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "Invalid environment variables",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
})();
