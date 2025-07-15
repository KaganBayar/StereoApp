"use client";
import { access_cookie } from "@/lib/actions";
import UserContext from "@/contexts/UserContext";
import { DispatchContext } from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";
import { initialStateType } from "@/contexts/initialState";
import { useEffect } from "react";
import { verifyToken, getToken } from "@/lib/auth";

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
    console.log("LEEEL", getToken());
    access_cookie().then((res) => {
      console.log(verifyToken(res));
    });
  });
  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}
