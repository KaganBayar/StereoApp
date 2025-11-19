"use client";
import { Playlist } from "@/lib/shared/Types/playlistTypes";
import { initialUser } from "@/lib/shared/initialState";
import { UserFrontend } from "@/lib/shared/Types/userTypes";

export type actionType =
  | {
      type: "LOGIN";
      payload: UserFrontend;
    }
  | { type: "LOGOUT" }
  | {
      type: "ADDPLAYLIST";
      payload: Playlist[];
    }
  | {
      type: "REMOVEPLAYLIST";
      payload: string;
    };

export default function reducer(state: UserFrontend, action: actionType) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return initialUser;
    case "ADDPLAYLIST":
      return {
        ...state,
        playlists: action.payload,
      };
    case "REMOVEPLAYLIST":
      return {
        ...state,
        playlists: state.playlists.filter(
          (playlist) => playlist.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
