"use client";
import { actionType } from "@/contexts/Reducer";
import { createContext } from "react";
import { initialStateType } from "@/contexts/initialState";

const UserContext = createContext<initialStateType | null>(null);
const DispatchContext = createContext<React.Dispatch<actionType> | null>(null);

export default UserContext;
export { DispatchContext };
