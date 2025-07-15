"use client";
import { initialStateType } from "@/contexts/initialState";
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
      };
    }
  | { type: "LOGOUT" }
  | {
      type: "ADDPLAYLIST";
      payload: Playlists[];
    };

export default function reducer(state: initialStateType, action: actionType) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: { name: "", email: "", photo: "", id: "", playlists: [] },
      };
    case "ADDPLAYLIST":
      return {
        ...state,
        playlists: action.payload,
      };
    default:
      return state;
  }
}
