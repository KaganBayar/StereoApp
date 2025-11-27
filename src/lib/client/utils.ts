import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserFrontend } from "../shared/Types/userTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkUser(user: UserFrontend | null): boolean {
  if (!user) {
    return false;
  }
  if (user.id === "") {
    return false;
  }
  return true;
}
