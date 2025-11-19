"use server";
import { container } from "../../DI_container/container";
import { formRegisterSchema } from "../../Schemas/register";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { formLoginSchema } from "../../Schemas/login";
import {
  setAccessCookie,
  setRefreshCookie,
  deleteAccessCookie,
  deleteRefreshCookie,
  getRefreshCookie,
  getAccessCookie,
} from "../../cookie";
import { ref } from "firebase/storage";
import { initialUser } from "@/lib/shared/initialState";
import { distillUserToFrontend } from "../../auth";
import { UserFrontend } from "@/lib/shared/Types/userTypes";

const authService = container.authService;
const cookieService = container.cookieService;
const tokenService = container.tokenService;
const userRepository = container.userRepository;

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
  const loginPayload = await authService.login(email, password);

  await cookieService.setAccessCookie(loginPayload.accessToken);
  await cookieService.setRefreshCookie(loginPayload.refreshToken);

  return loginPayload.user;
}

export async function logout(id: string) {
  const user = await authMiddleware.requireValidUser();
  if (!user) throw new Error("User not authenticated");
  await authService.logout(id);
  await cookieService.deleteAccessCookie();
  await cookieService.deleteRefreshCookie();
}

export async function refreshAccessToken() {
  const refreshToken = await cookieService.getRefreshCookie();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  try {
    const { newRefreshToken, newAccessToken } =
      await tokenService.refreshAccessToken(refreshToken);

    await cookieService.deleteAccessCookie();
    await cookieService.deleteRefreshCookie();

    await cookieService.setAccessCookie(newAccessToken);
    await cookieService.setRefreshCookie(newRefreshToken);
  } catch (error) {
    await cookieService.deleteAccessCookie();
    await cookieService.deleteRefreshCookie();
    throw new Error("Could not refresh tokens: " + error);
  }
}

export async function getUserFromSession(): Promise<UserFrontend> {
  try {
    // Try to get user from middleware validation
    const userPayload = await authMiddleware.requireValidUser();

    // Fetch fresh user data from database
    const user = await userRepository.findById(userPayload.id);

    if (!user) {
      console.log("initialUser returned");
      return initialUser;
    }

    return distillUserToFrontend(user);
  } catch (error) {
    // Session invalid, expired, or doesn't exist
    console.error("failed to fetch user from session:", error);
    return initialUser;
  }
}

export async function test() {
  console.log(getAccessCookie(), "lalala");
  setAccessCookie("deneme12345");
  console.log(getAccessCookie(), "lalala2");
}
