"use server";
import prisma from "@/lib/server/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { signToken } from "@/lib/server/auth";
import { findUserPlaylists } from "@/lib/server/dbActions";
import { cookies } from "next/headers";
import * as jose from "jose";
import { Playlists } from "../shared/types";
import { UserPayload } from "../shared/types";
import {
  requireValidUser,
  requireAdminUser,
} from "@/lib/server/serverValidation";

const formRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

//Auth

export async function createAuthTokenAction(payload: UserPayload) {
  return await signToken(payload); // Use utility function
}

export async function verifyAuthTokenAction(
  token: string
): Promise<UserPayload> {
  if (!token) {
    throw new Error("Token is required for verification");
  } else {
    try {
      const verifiedToken = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_KEY),
        {
          algorithms: ["HS256"],
        }
      );

      const tokenPayload = verifiedToken.payload as UserPayload;

      console.log("VERIFIED");
      return tokenPayload;
    } catch (e) {
      if (e instanceof jose.errors.JWTExpired) {
        try {
          const newAccessToken = await refreshAccessTokenAction(token);
          if (!newAccessToken) {
            throw new Error("No access token outputed by refresh action");
          }
          return newAccessToken as UserPayload;
        } catch (error) {
          throw new Error("Failed to refresh access token: " + error);
        }
      } else {
        throw new Error("Token verification failed: " + e);
      }
    }
  }
}

export async function register(formData: FormData) {
  const data = formRegisterSchema.parse(Object.fromEntries(formData));

  if (!data.email || !data.password) {
    throw new Error("Username Or Password required");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.users.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  console.log("registered");
}

export async function login(formData: FormData) {
  //Parola ve email doğrulama
  const data = formLoginSchema.parse(Object.fromEntries(formData));

  const user = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new Error("Password incorrect");
  }

  console.log("logged in");
  //refresh token oluşturma
  const cookieStore = await cookies();
  const refreshToken = crypto.randomBytes(32).toString("hex");

  await prisma.refreshTokens.deleteMany({
    where: {
      user_id: user.id,
    },
  });

  await prisma.refreshTokens.create({
    data: {
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  //access token oluşturma
  const playlists: Playlists[] = await findUserPlaylists(user.id);
  const accessToken = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    roles: user.roles,
    photo: user.photo,
    playlists: playlists,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });

  try {
    await verifyAuthTokenAction(accessToken);

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //csrf'yi araştır bidaha
      expires: new Date(Date.now() + 60 * 1000), // 1 minute
      path: "/",
    });

    console.log("LOOOL", cookieStore.get("accessToken"));
  } catch (e) {
    throw new Error("Token verification failed");
  }
}

export async function findUserByEmail(email: string) {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });
  return user;
}

export async function logout(id: string) {
  try {
    const currentUser = await requireValidUser();

    if (!currentUser) {
      throw new Error("You cant Logout Without User");
    }

    const cookieStore = await cookies();
    cookieStore.delete("accessToken");

    await prisma.refreshTokens.deleteMany({
      where: {
        user_id: id,
      },
    });
    console.log("logged out");
  } catch (error) {
    // If validation fails, still proceed with logout cleanup for security
    console.log("Logout validation failed, proceeding with cleanup:", error);
  }
}

export async function systemLogout(id: string) {
  try {
    await prisma.refreshTokens.deleteMany({
      where: {
        user_id: id,
      },
    });
  } catch (error) {
    throw new Error("System logout failed: " + error);
  }
}

export async function access_cookie() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || "No access token found";
}

export async function refreshAccessTokenAction(token: string) {
  if (!token) {
    throw new Error("No token provided");
  } else {
    try {
      const cookieStore = await cookies();
      const decodedToken = jose.decodeJwt(token) as UserPayload;
      const refreshToken = await prisma.refreshTokens.findFirst({
        where: {
          user_id: decodedToken.id,
        },
      });
      if (!refreshToken || refreshToken.expires_at < new Date()) {
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }
        throw new Error("Refresh token expired");
      }
      //sign new token
      const newAccessToken = await signToken({
        id: decodedToken.id,
        password: decodedToken.password,
        email: decodedToken.email,
        name: decodedToken.name,
        roles: decodedToken.roles,
        photo: decodedToken.photo,
        playlists: decodedToken.playlists,
        updated_at: decodedToken.updated_at,
        created_at: decodedToken.created_at,
      });
      //verify new token
      const decodedPayload = jose.decodeJwt(newAccessToken) as UserPayload;

      console.log("COOKIE", newAccessToken);
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 60 * 1000 * 24 * 60), // 1 day
        path: "/",
      });
      //send refresh page order to client
      return decodedPayload;
    } catch (error) {
      throw new Error("Failed to refresh access token: " + error);
    }
  }
}
