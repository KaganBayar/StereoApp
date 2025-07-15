import { Playlists } from "@/lib/types";

export type initialStateType = {
  user: {
    id: string;
    photo: string;
    name: string;
    email: string;
    playlists: Playlists[];
  };
};

const initialState: initialStateType = {
  user: {
    id: "",
    photo: "",
    name: "",
    email: "",
    playlists: [],
  },
};
export default initialState;
