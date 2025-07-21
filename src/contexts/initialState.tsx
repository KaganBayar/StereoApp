import { Playlists, User } from "@/lib/types";

const initialUser: User = {
  id: "",
  photo: "",
  name: "",
  email: "",
  playlists: [],
  roles: ["member"],
  created_at: null,
  updated_at: null,
};
export default initialUser;
