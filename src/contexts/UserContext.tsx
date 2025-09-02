"use client";
import { actionType } from "@/contexts/Reducer";
import { createContext, useState } from "react";
import { User } from "@/lib/shared/types";
const selectedSongByUserContext = createContext<
  [string | null, React.Dispatch<React.SetStateAction<string | null>>]
>([null, () => {}]);

const UserContext = createContext<User | null>(null);
const DispatchContext = createContext<React.Dispatch<actionType> | null>(null);
const UserInformationLoadingContext = createContext<boolean>(false);

export default UserContext;
export { DispatchContext };
export { UserInformationLoadingContext };
export { selectedSongByUserContext };
