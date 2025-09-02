"use client";

import Box from "./misc/Box";
import PlaylistBar from "./PlaylistBar";
import UserContext from "@/contexts/UserContext";
import { useContext } from "react";

export default function Sidebar({}) {
  //[UPDATE NEEDED] You shouldnt get user with useContext userContext because if user's informations are not up to date it shouldnt throw an error.
  //not use requireValidation until error handling is done
  const user = useContext(UserContext);
  return (
    <Box className="pl-8 mt-16 w-96 flex flex-col relative">
      <div className="flex justify-between w-full ">
        <p>{(user.name ? user.name + "'s" : "Your") + " Library"}</p>
      </div>

      <div className="mt-12">
        <PlaylistBar />
      </div>
    </Box>
  );
}
