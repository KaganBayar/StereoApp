import {
  AlbumFormData,
  ArtistFormData,
  SongFormData,
  Playlist,
  User,
} from "@/lib/shared/types";

const initialUser: Omit<User, "password"> = {
  id: "",
  photo_url: "",
  name: "",
  email: "",
  playlists: [],
  roles: ["member"],
  created_at: new Date(),
  updated_at: new Date(),
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

export default initialUser;
export { initialAlbum, initialArtist, initialSong };
