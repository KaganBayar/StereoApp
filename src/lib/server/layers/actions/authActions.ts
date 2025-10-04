"use server";
import { container } from "../../DI_container/container";
import { formRegisterSchema } from "../../Schemas/register";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { formLoginSchema } from "../../Schemas/login";

export class AuthActions {
  private authService = container.authService;
  async register(formdata: FormData) {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } =
      formRegisterSchema.parse(Object.fromEntries(formdata));
    return await this.authService.register(name, email, password);
  }
  async login(formdata: FormData) {
    const { email, password }: { email: string; password: string } =
      formLoginSchema.parse(Object.fromEntries(formdata));
    return await this.authService.login(email, password);
  }

  async logout(id: string) {
    const user = await authMiddleware.requireValidUser();
    if (!user) throw new Error("User not authenticated");

    return await this.authService.logout(id);
  }
}

export const authActions = new AuthActions();
