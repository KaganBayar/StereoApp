import { Prisma } from "@prisma/client";

export type Playlist = Prisma.PlaylistGetPayload<{
  include: {
    playlistSongs: {
      include: {
        song: {
          include: {
            artist: true;
            album: true;
          };
        };
      };
    };
  };
}>;

export type PlaylistSong = Prisma.PlaylistSongGetPayload<{
  include: {
    song: {
      include: {
        artist: true;
        album: true;
      };
    };
  };
}>;
