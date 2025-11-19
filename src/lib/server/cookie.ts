"use server";
import { cookies } from "next/headers";
import { CookieOptions } from "./Types/cookie";
import { time } from "@/lib/shared/Types/commonTypes";

export const getCookie = async (name: string): Promise<string> => {
  const cookieStore = await cookies();
  const data = cookieStore.get(name);
  if (!data) throw new Error("Cookie not found");
  return data.value;
};

export const setCookie = async (
  name: string,
  value: string,
  options?: CookieOptions
): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set(name, value, options);
};

export const setAccessCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 20 * time.MINUTE,
    path: "/",
  };

  cookieStore.set("accessToken", token, options);
};
export const deleteCookie = async (name: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
export const deleteAccessCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
};

export const getAccessCookie = async (): Promise<string> => {
  const cookieStore = await cookies();
  const data = cookieStore.get("accessToken");
  if (!data) throw new Error("Cookie not found");
  return data.value;
};

export const setRefreshCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * time.MINUTE * 24 * 30, // 30 days
    path: "/",
  };

  cookieStore.set("refreshToken", token, options);
};
export const getRefreshCookie = async (): Promise<string> => {
  const cookieStore = await cookies();
  const data = cookieStore.get("refreshToken");
  if (!data) throw new Error("Cookie not found");
  return data.value;
};
export const deleteRefreshCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
};
