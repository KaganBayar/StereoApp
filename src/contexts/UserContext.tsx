"use client";
import { actionType } from "@/contexts/Reducer";
import { createContext } from "react";
import { UserFrontend } from "@/lib/shared/Types/userTypes";

const selectedSongByUserContext = createContext<
  [string | null, React.Dispatch<React.SetStateAction<string | null>>]
>([null, () => {}]);

const UserContext = createContext<UserFrontend | null>(null);
const UserInformationLoadingContext = createContext<boolean>(false);
const DispatchContext = createContext<React.Dispatch<actionType> | null>(null);

export default UserContext;
export { DispatchContext };
export { UserInformationLoadingContext };
export { selectedSongByUserContext };
