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
} from "../../cookie";
import { ref } from "firebase/storage";

const authService = container.authService;
const tokenService = container.tokenService;

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

  await setAccessCookie(loginPayload.accessToken);
  await setRefreshCookie(loginPayload.refreshToken);

  return loginPayload.user;
}

export async function logout(id: string) {
  const user = await authMiddleware.requireValidUser();
  if (!user) throw new Error("User not authenticated");
  await authService.logout(id);
  await deleteAccessCookie();
  await deleteRefreshCookie();
}

export async function verifyAccessToken(token: string) {
  try {
    return await tokenService.verifyAuthToken(token);
  } catch (error) {
    await deleteAccessCookie();
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    return await tokenService.verifyRefreshToken(token);
  } catch (error) {
    await deleteRefreshCookie();
  }
}

export async function refreshAccessToken() {
  const refreshToken = await getRefreshCookie();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  try {
    const { newRefreshToken, newAccessToken } =
      await tokenService.refreshAccessToken(refreshToken);

    await deleteAccessCookie();
    await deleteRefreshCookie();

    await setAccessCookie(newAccessToken);
    await setRefreshCookie(newRefreshToken);
  } catch (error) {
    await deleteAccessCookie();
    await deleteRefreshCookie();
    throw new Error("Could not refresh tokens: " + error);
  }
}
