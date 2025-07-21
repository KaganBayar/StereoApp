"use client";
import { actionType } from "@/contexts/Reducer";
import { createContext } from "react";
import { User } from "@/contexts/initialState";

const UserContext = createContext<User | null>(null);
const DispatchContext = createContext<React.Dispatch<actionType> | null>(null);
const UserInformationLoadingContext = createContext<boolean>(false);

export default UserContext;
export { DispatchContext };
export { UserInformationLoadingContext };
