"use server";
import { container } from "../../DI container/container";
import { formRegisterSchema } from "../../Schemas/register";
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
      formRegisterSchema.parse(Object.fromEntries(formdata));
    return await this.authService.login(email, password);
  }
  async logout() {
    const user = await this.authService.validateUserSession();
    return await this.authService.logout(user.id);
  }
}
