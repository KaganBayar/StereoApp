"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import crypto from "crypto";
import { signToken } from "@/lib/auth";
import { verifyToken } from "@/lib/auth";
import { findUserIdFromEmail } from "@prisma/client/sql";
import { createPlaylist } from "@prisma/client/sql";
import { cookies } from "next/headers";
import * as jose from "jose";
import { Playlists } from "../lib/types";
import { UserPayload } from "../lib/types";

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

export async function createAuthTokenAction(payload: jose.JWTPayload) {
  return await signToken(payload); // Use utility function
}

export async function verifyAuthTokenAction(token: string) {
  return await verifyToken(token); // Use utility function
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

  console.log(
    await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    })
  );
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
  const playlists: Playlists[] = await findUserPlaylists(user.email);
  const accessToken = await signToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    photo: user.photo,
    playlists: playlists,
  });

  try {
    await verifyToken(accessToken);

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //csrf'yi araştır bidaha
      expires: new Date(Date.now() + 60 * 1000 * 24 * 60), // 1 minute
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

export async function createPlaylistAction(email: string) {
  const userId = await prisma.$queryRawTyped(findUserIdFromEmail(email));
  const playlistId = await prisma.$queryRawTyped(createPlaylist(userId[0].id));
  console.log("playlist created");
  return playlistId[0];
}

export async function findUserPlaylists(email: string) {
  // First get the user ID from email
  const user = await prisma.users.findFirst({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Then fetch all playlists belonging to this user
  const playlists = await prisma.playlist.findMany({
    where: {
      user_id: user.id,
    },
  });

  return playlists;
}

export async function logout(id: string) {
  const cookieStore = await cookies();
  cookieStore.delete("accesToken");
  await prisma.refreshTokens.deleteMany({
    where: {
      user_id: id,
    },
  });
  console.log("logged out");
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
      const decodedToken = jose.decodeJwt(token) as UserPayload;
      //sign new token
      const newAccessToken = await signToken({
        userId: decodedToken.userId,
        email: decodedToken.email,
        name: decodedToken.name,
        roles: decodedToken.roles,
        photo: decodedToken.photo,
        playlists: decodedToken.playlists,
      });
      //verify new token
      const verifiedToken = await verifyToken(newAccessToken);
      if (!verifiedToken) {
        throw new Error("Token verification failed");
      }
      //Umarım üstüne yazıyordur cookieyi
      const cookieStore = await cookies();
      console.log("COOKIE", newAccessToken);
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 60 * 1000 * 24 * 60), // 1 day
        path: "/",
      });
    } catch (error) {
      throw new Error("Failed to refresh access token: " + error);
    }
  }
}
