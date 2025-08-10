import { Playlists, User } from "@/lib/types";

const initialUser: Omit<User, "password"> = {
  id: "",
  photo: "",
  name: "",
  email: "",
  playlists: [],
  roles: ["member"],
  created_at: new Date(),
  updated_at: new Date(),
};
export default initialUser;
