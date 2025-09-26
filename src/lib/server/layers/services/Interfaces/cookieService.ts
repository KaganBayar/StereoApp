import { CookieOptions } from "../../../Types/cookie";
export interface CookieServiceInterface {
  getCookie(name: string): Promise<string>;
  setCookie(
    name: string,
    value: string,
    options?: CookieOptions
  ): Promise<void>;
  deleteCookie(name: string): Promise<void>;
  setAcessCookie(token: string): Promise<void>;
}
