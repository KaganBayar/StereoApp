"use client";
import UserContext from "@/contexts/UserContext";
import {
  DispatchContext,
  UserInformationLoadingContext,
} from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";

import { User } from "@/lib/types";
import { useEffect } from "react";
import { access_cookie, verifyAuthTokenAction } from "@/lib/actions";
import { useState } from "react";


interface UserProviderProps {
  User: User;
  children: React.ReactNode;
  reduce: React.Reducer<User, actionType>;
}
export default function UserProvider({
  User,
  children,
  reduce,
}: UserProviderProps) {
  const [user, dispatch] = useReducer(reduce, User);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

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
              return;
            }

            if (
              typeof verifiedAccessToken.id === "string" &&
              typeof verifiedAccessToken.email === "string" &&
              typeof verifiedAccessToken.name === "string" &&
              typeof verifiedAccessToken.photo === "string" &&
              Array.isArray(verifiedAccessToken.playlists) &&
              Array.isArray(verifiedAccessToken.roles)
            ) {
              const userDatas: User = {
                id: verifiedAccessToken.id,
                email: verifiedAccessToken.email,
                name: verifiedAccessToken.name,
                password: verifiedAccessToken.password,
                photo: verifiedAccessToken.photo,
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
                    photos: userDatas.photo,
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
          {children}
        </UserInformationLoadingContext.Provider>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}
