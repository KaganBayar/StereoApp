"use server";
import {
  Artist,
  SongUpdateFormData,
  SongCreateFormData,
  User,
  UserAdminEditForm,
} from "@/lib/shared/types";
import { Album } from "@/lib/shared/types";
import prisma from "@/lib/server/db";
import {
  AlbumFormData,
  ArtistCreateFormData,
  ArtistUpdateFormData,
} from "@/lib/shared/types";
import {
  requireValidUser,
  requireAdminUser,
} from "@/lib/server/serverValidation";
import { Song } from "@/lib/shared/types";

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
  const currentUser = await requireValidUser();

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
      photo: "default.jpg", // Assuming a default photo
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
  const playlists = await prisma.playlist.findMany({
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

export async function createAuthor(data: ArtistCreateFormData) {
  await requireAdminUser();
  //buraya geri dön yarın
  const author = await prisma.author.create({
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
  return author;
}

export async function updateAuthor(id: string, data: ArtistUpdateFormData) {
  await requireAdminUser();

  const author = await prisma.author.update({
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
  return author;
}

export async function deleteAuthor(id: string) {
  await requireAdminUser();

  const author = await prisma.author.delete({
    where: { id },
  });
  return author;
}

export async function createAlbum(data: AlbumCreateFormData) {
  await requireAdminUser();

  const album = await prisma.albums.create({
    data: {
      title: data.title,
      artistId: data.artistId,
      releaseDate: data.releaseDate,
      cover_url: data.cover_url,
    },
    include: {
      song: true,
    },
  });
  return album;
}
// Update çalışmıyor
export async function updateAlbum(
  id: string,
  data: Partial<AlbumUpdateFormData>
) {
  await requireAdminUser();

  const album = await prisma.albums.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      song: true,
    },
  });
  return album;
}

export async function deleteAlbum(id: string) {
  await requireAdminUser();

  const album = await prisma.albums.delete({
    where: { id },
  });
  return album;
}

export async function createSong(data: SongCreateFormData) {
  await requireAdminUser();

  const song = await prisma.song.create({
    data: {
      name: data.name,
      author_id: data.author_id,
      albumsId: data.albumsId,
      song_url: data.song_url,
      photo: data.photo || "",
      length: data.length || 0,
    },
    include: {
      Albums: true,
      author: true,
    },
  });
  return song;
}

export async function updateSong(id: string, data: SongUpdateFormData) {
  await requireAdminUser();

  const song = await prisma.song.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      Albums: true,
      author: true,
    },
  });
  return song;
}

export async function deleteSong(id: string) {
  await requireAdminUser();

  const song = await prisma.song.delete({
    where: { id },
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
    prisma.users.findMany({
      skip,
      take: limit,
      include: {
        playlists: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.users.count(),
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
