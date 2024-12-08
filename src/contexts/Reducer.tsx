"use client";
import { initialStateType } from "@/contexts/initialState";

export type actionType =
  | { type: "LOGIN"; payload: { name: string; email: string } }
  | { type: "LOGOUT" };

export default function reducer(state: initialStateType, action: actionType) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: { name: "", email: "" } };
    default:
      return state;
  }
}
