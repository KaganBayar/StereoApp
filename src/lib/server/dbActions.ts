"use server";
import { Artist, User, UserAdminEditForm } from "@/lib/shared/types";
import { Album } from "@/lib/shared/types";
import prisma from "@/lib/server/db";
import { AlbumFormData, ArtistFormData } from "@/lib/shared/types";
import {
  requireValidUser,
  requireAdminUser,
} from "@/lib/server/serverValidation";
import { Song } from "@/lib/shared/types";
import { Playlist } from "@prisma/client";
import { SongFormData } from "@/lib/shared/types";

//code parts with 0 pagination. should not be used in code
export async function findAllAlbums() {
  const albums: Album[] = await prisma.album.findMany({
    include: {
      songs: true,
      artist: true,
    },
  });
  return albums;
}

export async function findAllArtists() {
  const artists: Artist[] = await prisma.artist.findMany({
    include: {
      albums: true,
      songs: true,
    },
  });
  return artists;
}

export async function findAllSongs() {
  const songs: Song[] = await prisma.song.findMany({
    include: {
      album: true,
      artist: true,
    },
  });
  return songs;
}

export async function findAllUsers() {
  // Require admin access
  await requireAdminUser();

  const users: User[] = await prisma.user.findMany({
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
    },
  });
  return users;
}

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
    },
  });
  return user;
}

export async function updateUser(id: string, dataForm: UserAdminEditForm) {
  // Require admin access
  await requireAdminUser();

  const updatedUser: User = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...dataForm,
      updated_at: new Date(),
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
    },
  });
  return updatedUser;
}

export async function deleteUser(id: string) {
  // Require admin access
  await requireAdminUser();

  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return deletedUser;
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
      photo_url: "default.jpg", // Assuming a default photo
    },
    select: {
      id: true,
    },
  });
  console.log("playlist created");
  return playlistId.id;
}

export async function findUserPlaylists(id: string) {
  // Then fetch all playlists belonging to this user
  const playlists: Playlist[] = await prisma.playlist.findMany({
    where: {
      user_id: id,
    },
    include: {
      playlistSongs: {
        include: {
          song: true,
        },
      },
    },
  });

  return playlists;
}

export async function createArtist(data: ArtistFormData) {
  await requireAdminUser();
  const artist: Artist = await prisma.artist.create({
    data: {
      name: data.name,
      genre: data.genre,
      bio: data.bio,
      photo_url: data.photo_url,
    },
    include: {
      albums: true,
      songs: true,
    },
  });
  return artist;
}

export async function updateArtist(id: string, data: Partial<ArtistFormData>) {
  await requireAdminUser();

  const artist: Artist = await prisma.artist.update({
    where: { id },
    data: {
      bio: data?.bio,
      genre: data?.genre,
      name: data?.name,
      photo_url: data?.photo_url,
      updated_at: new Date(),
    },
    include: {
      albums: true,
      songs: true,
    },
  });
  return artist;
}

export async function deleteArtist(id: string) {
  await requireAdminUser();

  const artist: Artist = await prisma.artist.delete({
    where: { id },
    include: {
      albums: true,
      songs: true,
    },
  });
  return artist;
}

export async function createAlbum(data: AlbumFormData) {
  await requireAdminUser();

  const album: Album = await prisma.album.create({
    data: {
      title: data.title,
      artist_id: data.artist_id,
      releaseDate: data.releaseDate,
      photo_url: data.photo_url,
    },
    include: {
      songs: true,
      artist: true,
    },
  });
  return album;
}

export async function updateAlbum(id: string, data: Partial<AlbumFormData>) {
  await requireAdminUser();

  const album: Album = await prisma.album.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      songs: true,
      artist: true,
    },
  });
  return album;
}

export async function deleteAlbum(id: string) {
  await requireAdminUser();

  const album: Album = await prisma.album.delete({
    where: { id },
    include: {
      songs: true,
      artist: true,
    },
  });
  return album;
}

export async function createSong(data: SongFormData) {
  await requireAdminUser();

  const song: Song = await prisma.song.create({
    data: {
      name: data.name,
      artist_id: data.artist_id,
      album_id: data.album_id,
      song_url: data.song_url,
      photo_url: data.photo_url || "",
      length: data.length || 0,
      releaseDate: data.releaseDate || new Date(), // you should provide relasedate in frontend but not needed for now
      genre: data.genre || "", //you should provide genre in frontend but not needed for now
    },
    include: {
      album: true,
      artist: true,
    },
  });
  return song;
}

export async function updateSong(id: string, data: SongFormData) {
  await requireAdminUser();

  const song: Song = await prisma.song.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      album: true,
      artist: true,
    },
  });
  return song;
}

export async function deleteSong(id: string) {
  await requireAdminUser();

  const song: Song = await prisma.song.delete({
    where: { id },
    include: {
      album: true,
      artist: true,
    },
  });

  return song;
}

export async function findAllUsersWithPagination(
  page: number = 1,
  limit: number = 10
) {
  await requireAdminUser();

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      include: {
        playlists: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// PlaylistSong junction table operations
export async function addSongToPlaylist(playlistId: string, songId: string) {
  await requireValidUser();

  const playlistSong = await prisma.playlistSong.create({
    data: {
      playlist_id: playlistId,
      song_id: songId,
    },
  });
  return playlistSong;
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
) {
  await requireValidUser();

  const deletedPlaylistSong = await prisma.playlistSong.deleteMany({
    where: {
      playlist_id: playlistId,
      song_id: songId,
    },
  });
  return deletedPlaylistSong;
}
