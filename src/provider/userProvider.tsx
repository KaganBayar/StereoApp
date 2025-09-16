"use client";
import UserContext from "@/contexts/UserContext";
import {
  DispatchContext,
  UserInformationLoadingContext,
  selectedSongByUserContext,
} from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";
import { useEffect } from "react";
import { access_cookie, verifyAuthTokenAction } from "@/lib/server/actions";
import { useState } from "react";
import { AudioProvider } from "@/contexts/audioContext";
import { UserFrontend } from "@/lib/Types/userTypes";

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
  const [user, dispatch] = useReducer(reduce, User);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  //you should confirm if var a's value chanegd between fetches it should use new value of var a. also you shouldnt fetch in effect
  useEffect(() => {
    async function fetchUser() {
      try {
        const accessToken = await access_cookie();
        if (accessToken) {
          if (accessToken === "No access token found") {
            console.log("No access token found");
            return;
          } else {
            setIsAuthLoading(true);
            const verifiedAccessToken = await verifyAuthTokenAction(
              accessToken
            );
            console.log("verifiedAccessToken", verifiedAccessToken);

            if (!verifiedAccessToken) {
              console.log("Token verification failed");
              cookieStore.delete("accessToken");
              return;
            }

            if (
              typeof verifiedAccessToken.id === "string" &&
              typeof verifiedAccessToken.email === "string" &&
              typeof verifiedAccessToken.name === "string" &&
              typeof verifiedAccessToken.photo_url === "string" &&
              Array.isArray(verifiedAccessToken.playlists) &&
              Array.isArray(verifiedAccessToken.roles)
            ) {
              const userDatas: UserFrontend = {
                id: verifiedAccessToken.id,
                email: verifiedAccessToken.email,
                name: verifiedAccessToken.name,
                photo_url: verifiedAccessToken.photo_url,
                roles: verifiedAccessToken.roles,
                playlists: verifiedAccessToken.playlists,
                created_at: verifiedAccessToken.created_at,
                updated_at: verifiedAccessToken.updated_at,
              };
              if (dispatch) {
                dispatch({
                  type: "LOGIN",
                  payload: {
                    id: userDatas.id,
                    photo_url: userDatas.photo_url,
                    name: userDatas.name,
                    email: userDatas.email,
                    playlists: userDatas.playlists,
                    roles: userDatas.roles,
                    created_at: userDatas.created_at,
                    updated_at: userDatas.updated_at,
                  },
                });
              }
              return;
            } else {
              console.log("Invalid token data structure");
              cookieStore.delete("accessToken");
              return;
            }
          }
        }
      } catch (error) {
        throw new Error("Failed to fetch user data: " + error);
      } finally {
        setIsAuthLoading(false);
      }
    }
    fetchUser();
  }, [dispatch]);
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
