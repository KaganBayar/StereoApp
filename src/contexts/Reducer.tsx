"use client";
import { User } from "@/lib/types";
import { Playlists } from "@/lib/types";

export type actionType =
  | {
      type: "LOGIN";
      payload: {
        id: string;
        name: string;
        email: string;
        photos: string;
        playlists: Playlists[];
        roles: string[];
        created_at: Date | null;
        updated_at: Date | null;
      };
    }
  | { type: "LOGOUT" }
  | {
      type: "ADDPLAYLIST";
      payload: Playlists[];
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
      return {
        ...state,
        user: {
          name: "",
          email: "",
          photo: "",
          id: "",
          playlists: [],
          created_at: null,
          updated_at: null,
        },
      };
    case "ADDPLAYLIST":
      return {
        ...state,
        playlists: action.payload,
      };
    case "REMOVEPLAYLIST":
      return {
        ...state,
        playlists: state.playlists.filter(playlist => playlist.id !== action.payload),
      };
    default:
      return state;
  }
}
