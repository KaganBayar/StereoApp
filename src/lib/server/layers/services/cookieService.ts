import { cookies } from "next/headers";
import { CookieOptions } from "../../Types/cookie";
import { time } from "@/lib/Types/commonTypes";

export class CookieService {
  public async getCookie(name: string): Promise<string> {
    const cookieStore = await cookies();
    const data = cookieStore.get(name);
    if (!data) throw new Error("Cookie not found");
    return data.value;
  }

  public async setCookie(
    name: string,
    value: string,
    options?: CookieOptions
  ): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(name, value, options);
  }

  public async setAccessCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    const options: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20 * time.MINUTE,
      path: "/",
    };

    cookieStore.set("accessToken", token, options);
  }
  public async deleteCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  }
  public async deleteAccessCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
  }

  public async getAccessCookie(): Promise<string> {
    const cookieStore = await cookies();
    const data = cookieStore.get("accessToken");
    if (!data) throw new Error("Cookie not found");
    return data.value;
  }

  public async setRefreshCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    const options: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * time.MINUTE * 24 * 30, // 30 days
      path: "/",
    };

    cookieStore.set("refreshToken", token, options);
  }
  public async getRefreshCookie(): Promise<string> {
    const cookieStore = await cookies();
    const data = cookieStore.get("refreshToken");
    if (!data) throw new Error("Cookie not found");
    return data.value;
  }
  public async deleteRefreshCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
  }
}
