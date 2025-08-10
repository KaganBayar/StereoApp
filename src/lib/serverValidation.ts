"use server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { User, UserPayload } from "@/lib/types";
import { verifyAuthTokenAction } from "@/lib/actions";

export async function validateUserSession(): Promise<User> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("UNAUTHORIZED: No access token found");
  }

  try {
    // Verify the JWT token
    //access_token bittiğinde refreshlemiyor
    const verifiedToken = await verifyAuthTokenAction(accessToken);
    const tokenPayload = verifiedToken as UserPayload;

    // Check if user still exists and is active in database
    const currentUser = await prisma.users.findFirst({
      where: {
        id: tokenPayload.id,
      },
      include: {
        playlists: true,
      },
    });

    if (!currentUser) {
      throw new Error("UNAUTHORIZED: User no longer exists");
    }

    // Check if user data has been modified after token was issued
    const tokenIssuedAt = new Date((tokenPayload.iat || 0) * 1000);
    const userLastUpdated = currentUser.updated_at || currentUser.created_at;

    if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
      await prisma.refreshTokens.deleteMany({
        where: {
          user_id: currentUser.id,
        },
      });
      cookieStore.delete("accessToken");
      throw new Error(
        "UNAUTHORIZED: User data has been modified. Please re-authenticate."
      );
    }

    // Return fresh user data from database instead of token data
    return {
      id: currentUser.id,
      password: currentUser.password,
      email: currentUser.email,
      name: currentUser.name,
      roles: currentUser.roles,
      photo: currentUser.photo,
      playlists: currentUser.playlists,
      created_at: currentUser.created_at,
      updated_at: currentUser.updated_at,
    };
  } catch (error) {
    throw error;
  }
}

export async function requireValidUser(): Promise<UserPayload> {
  try {
    return await validateUserSession();
  } catch (error) {
    // Clear invalid token
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");

    throw error;
  }
}

export async function requireAdminUser(): Promise<UserPayload> {
  const user = await requireValidUser();

  if (!user.roles.includes("admin")) {
    throw new Error("FORBIDDEN: Admin access required");
  }

  return user;
}
