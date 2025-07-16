"use client";
import UserContext from "@/contexts/UserContext";
import { DispatchContext } from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";
import { initialStateType } from "@/contexts/initialState";
import { useEffect } from "react";
import { access_cookie, verifyAuthTokenAction } from "@/lib/actions";

interface UserProviderProps {
  initialState: initialStateType;
  children: React.ReactNode;
  reduce: React.Reducer<initialStateType, actionType>;
}
export default function UserProvider({
  initialState,
  children,
  reduce,
}: UserProviderProps) {
  const [user, dispatch] = useReducer(reduce, initialState);
  useEffect(() => {
    async function fetchUser() {
      try {
        const accessToken = await access_cookie();
        if (accessToken) {
          if (accessToken === "No access token found") {
            console.log("No access token found");
            return;
          } else {
            const verifiedAccessToken = await verifyAuthTokenAction(
              accessToken
            );
            console.log("verifiedAccessToken", verifiedAccessToken);

            if (!verifiedAccessToken) {
              console.log("Token verification failed");
              return;
            }

            if (
              typeof verifiedAccessToken.userId === "string" &&
              typeof verifiedAccessToken.email === "string" &&
              typeof verifiedAccessToken.name === "string" &&
              typeof verifiedAccessToken.photo === "string" &&
              Array.isArray(verifiedAccessToken.playlists) &&
              Array.isArray(verifiedAccessToken.roles)
            ) {
              const userDatas: initialStateType = {
                user: {
                  id: verifiedAccessToken.userId,
                  email: verifiedAccessToken.email,
                  name: verifiedAccessToken.name,
                  photo: verifiedAccessToken.photo,
                  roles: verifiedAccessToken.roles,
                  playlists: verifiedAccessToken.playlists || [],
                },
              };
              if (dispatch) {
                dispatch({
                  type: "LOGIN",
                  payload: {
                    id: userDatas.user.id,
                    photos: userDatas.user.photo,
                    name: userDatas.user.name,
                    email: userDatas.user.email,
                    playlists: userDatas.user.playlists,
                    roles: userDatas.user.roles,
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
      }
    }
    fetchUser();
  }, [dispatch]);
  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}
