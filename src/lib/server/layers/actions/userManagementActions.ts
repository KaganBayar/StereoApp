"use server";

import { container } from "../../DI_container/container";
import { User } from "@/lib/Types/userTypes";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const userService = container.userService;

export async function getAllUsers(): Promise<User[]> {
  return userService.getAllUsers();
}

export async function getUserById(id: string): Promise<User | null> {
  return userService.getUserById(id);
}

export async function deleteUser(id: string): Promise<User> {
  await authMiddleware.requireAdminUser();

  return userService.deleteUser(id);
}

export async function deleteManyUsers(ids: string[]): Promise<void> {
  await authMiddleware.requireAdminUser();

  return userService.deleteManyUsers(ids);
}
export async function createUser(data: User): Promise<User> {
  await authMiddleware.requireAdminUser();

  return userService.createUser(data);
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  await authMiddleware.requireAdminUser();

  return userService.updateUser(id, data);
}
