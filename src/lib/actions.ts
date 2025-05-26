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
import axios from "axios";

const formRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

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
  /*axios
    .post(
      "http://localhost:3000/api/login",
      {
        userId: `${user.id}`,
        username: `${user.name}`,
        email: `${user.email}`,
        roles: `${user.roles}`,
        photo: `${user.photo}`,
      },
      {
        withCredentials: true,
      }
    )
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    }); */

  console.log("logged in");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  await prisma.refreshTokens.create({
    data: {
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  const accessToken = await signToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles,
    photo: user.photo,
  });
  try {
    await verifyToken(accessToken);
    const cookieStore = await cookies();
    const accessCookie = cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5, // 1 hour in seconds
    });
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
  cookieStore.delete("access_token");
  await prisma.refreshTokens.deleteMany({
    where: {
      user_id: id,
    },
  });
  console.log("logged out");
}
