import { z } from "zod";
export const formRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});
