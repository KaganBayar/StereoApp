import { User } from "@/lib/shared/Types/userTypes";
import { ArtistFormData } from "@/lib/shared/Types/artistTypes";
import { AlbumFormData } from "@/lib/shared/Types/albumTypes";
import { SongFormData } from "@/lib/shared/Types/songTypes";
import { Playlist } from "@/lib/shared/Types/playlistTypes";

const initialUser: Omit<User, "password"> = {
  id: "",
  photo_url: "",
  name: "",
  email: "",
  playlists: [],
  roles: ["member"],
  created_at: new Date(),
  updated_at: new Date(),
  favorites: [],
}; // [UPDATE NEEDED] Backendden gelen user tipinde daha fazla bilgi var. ama frontend için bu kadar bilgi yeterli bunu değiştirmen gerek

const initialAlbum: AlbumFormData = {
  title: "",
  artist_id: "",
  releaseDate: new Date(),
  photo_url: "",
};

const initialArtist: ArtistFormData = {
  name: "",
  genre: "",
  bio: "",
  photo_url: "",
};

const initialSong: SongFormData = {
  name: "",
  artist_id: "",
  album_id: "",
  length: 0,
  genre: "",
  photo_url: "",
  song_url: "",
  releaseDate: new Date(),
};

const initialPlaylist = {
  id: "",
  name: "My Playlist",
  description: "This is My Playlist",
  user_id: "",
  totalSongs: 0,
  totalDuration: "0 seconds",
  isFollowed: false,
  photo_url: "",
};

export {
  initialUser,
  initialAlbum,
  initialArtist,
  initialSong,
  initialPlaylist,
};
