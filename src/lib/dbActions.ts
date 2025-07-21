"use server";
import prisma from "@/lib/db";
import { findUserIdFromEmail } from "@prisma/client/sql";
import { createPlaylist } from "@prisma/client/sql";

export async function findUserByEmail(email: string) {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });
  return user;
}
//pagination ekle
export async function findAllUsers() {
  const users = await prisma.users.findMany({
    include: {
      playlists: true,
    },
  });
  return users;
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
