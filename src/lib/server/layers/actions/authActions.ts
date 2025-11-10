"use server";
import { container } from "../../DI_container/container";
import { formRegisterSchema } from "../../Schemas/register";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { formLoginSchema } from "../../Schemas/login";

const authService = container.authService;

export async function register(formdata: FormData) {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } =
    formRegisterSchema.parse(Object.fromEntries(formdata));
  return await authService.register(name, email, password);
}

export async function login(formdata: FormData) {
  const { email, password }: { email: string; password: string } =
    formLoginSchema.parse(Object.fromEntries(formdata));
  return await authService.login(email, password);
}

export async function logout(id: string) {
  const user = await authMiddleware.requireValidUser();
  if (!user) throw new Error("User not authenticated");

  return await authService.logout(id);
}
