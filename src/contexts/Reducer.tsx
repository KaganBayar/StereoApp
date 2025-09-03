"use client";
import { User } from "@/lib/shared/types";
import { Playlist } from "@/lib/shared/types";
import { initialUser } from "@/lib/shared/initialState";

export type actionType =
  | {
      type: "LOGIN";
      payload: {
        id: string;
        name: string;
        email: string;
        photo_url: string;
        playlists: Playlist[];
        roles: string[];
        created_at: Date | null;
        updated_at: Date | null;
      };
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

export default function reducer(state: User, action: actionType) {
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
