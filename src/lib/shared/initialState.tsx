import { AlbumFormData, Playlists, User } from "@/lib/shared/types";

const initialUser: Omit<User, "password"> = {
  id: "",
  photo_url: "",
  name: "",
  email: "",
  playlists: [],
  roles: ["member"],
  created_at: new Date(),
  updated_at: new Date(),
};

const initialAlbum: AlbumFormData = {
  title: "",
  artist_id: "",
  releaseDate: new Date(),
  photo_url: "",
};

export default initialUser;
export { initialAlbum };
