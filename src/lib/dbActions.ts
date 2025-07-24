"use server";
import { findUserIdFromEmail } from "@prisma/client/sql";
import { createPlaylist } from "@prisma/client/sql";
import { Artist } from "@/lib/types";
import { Albums } from "@/lib/types";
import prisma from "@/lib/db";

export async function findAllAlbums() {
  const albums = await prisma.albums.findMany({
    include: {
      song: true,
    },
  });
  return albums satisfies Albums[];
}

export async function findAllAuthors() {
  const authors = await prisma.author.findMany({
    include: {
      albums: true,
      songs: true,
    },
  });
  return authors satisfies Artist[];
}

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
