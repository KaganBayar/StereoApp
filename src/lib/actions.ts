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
  const refreshToken = await signToken({
    email: user.email,
    name: user.name,
    photo: user.photo,
  });
  const verifiedRefreshToken = await verifyToken(refreshToken);
  if (!verifiedRefreshToken) {
    throw new Error("Token not verified");
  }
  prisma.refreshTokens.create({
    data: {
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  const cookieStore = cookies();

  console.log("logged in");
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
  return playlistId[0].id;
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
