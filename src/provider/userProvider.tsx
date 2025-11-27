"use client";
import UserContext from "@/contexts/UserContext";
import {
  DispatchContext,
  UserInformationLoadingContext,
  selectedSongByUserContext,
} from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";
import { useState } from "react";
import { AudioProvider } from "@/contexts/audioContext";
import { UserFrontend } from "@/lib/shared/Types/userTypes";
interface UserProviderProps {
  User: UserFrontend;
  children: React.ReactNode;
  reduce: React.Reducer<UserFrontend, actionType>;
}

export default function UserProvider({
  User,
  children,
  reduce,
}: UserProviderProps) {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [user, dispatch] = useReducer(reduce, User);

  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        <UserInformationLoadingContext.Provider value={isAuthLoading}>
          <selectedSongByUserContext.Provider
            value={useState<string | null>(null)}
          >
            <AudioProvider>{children}</AudioProvider>
          </selectedSongByUserContext.Provider>
        </UserInformationLoadingContext.Provider>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}
