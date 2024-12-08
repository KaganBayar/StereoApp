"use client";
import UserContext from "@/contexts/UserContext";
import { DispatchContext } from "@/contexts/UserContext";
import { useReducer } from "react";
import { actionType } from "@/contexts/Reducer";
import { initialStateType } from "@/contexts/initialState";

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
  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}
