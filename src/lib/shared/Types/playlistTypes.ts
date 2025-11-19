import { Prisma } from "@prisma/client";

export type BasePlaylist = Prisma.PlaylistGetPayload<{
  include: { playlistSongs: { include: { song: true } } };
}>;

export type Playlist = Prisma.PlaylistGetPayload<{
  include: {
    playlistSongs: {
      include: {
        song: true;
      };
    };
  };
}>;

export type PlaylistSong = Prisma.PlaylistSongGetPayload<{
  include: {
    song: true;
  };
}>;

export type PlaylistFormData = Pick<
  Playlist,
  "name" | "description" | "photo_url" | "user_id"
>;
