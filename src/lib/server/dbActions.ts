"use server";
import prisma from "@/lib/server/db";
import { AlbumFormData } from "@/lib/Types/albumTypes";
import {
  requireValidUser,
  requireAdminUser,
} from "@/lib/server/serverValidation";
import { Playlist } from "@/lib/Types/playlistTypes";
import { User, UserAdminEditForm } from "@/lib/Types/userTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { Album } from "@/lib/Types/albumTypes";
import { SongFormData, Song } from "@/lib/Types/songTypes";

//code parts with 0 pagination. should not be used in code

export async function findUserByEmail(email: string) {
  const user: User | null = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      playlists: {
        include: {
          playlistSongs: {
            include: {
              song: true,
            },
          },
        },
      },
      favorites: { include: { song: true } },
    },
  });
  return user;
}

export async function createPlaylistAction(email: string) {
  // Validate user session and get current user data
  const currentUser: User = await requireValidUser();

  // Ensure user can only create playlists for themselves
  if (currentUser.email !== email) {
    throw new Error("FORBIDDEN: Cannot create playlist for another user");
  }

  const userId = currentUser.id;
  //const playlistId = await prisma.$queryRawTyped(createPlaylist(userId[0].id));
  const playlistId = await prisma.playlist.create({
    data: {
      name: "My Playlist",
      description: "This is my playlist",
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
      photo_url: "", // Assuming a default photo
    },
    select: {
      id: true,
    },
  });
  console.log("playlist created");
  return playlistId.id;
}

export async function findUserPlaylists(id: string): Promise<Playlist[]> {
  // Then fetch all playlists belonging to this user
  const playlists: Playlist[] = await prisma.playlist.findMany({
    where: {
      user_id: id,
    },
    include: {
      playlistSongs: {
        include: {
          song: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
      },
    },
  });

  return playlists;
}
