"use server";
import { container } from "../../DI_container/container";
import { formRegisterSchema } from "../../Schemas/register";
import { getCurrentUser } from "../../auth";
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
  async logout() {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return await this.authService.logout(user.id);
  }
}
