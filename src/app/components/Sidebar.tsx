"use client";

import Box from "./Box";
import PlaylistBar from "./PlaylistBar";
import UserContext from "@/contexts/UserContext";
import { useContext } from "react";

export default function Sidebar({}) {
  const user = useContext(UserContext);
  return (
    <Box className="pl-8 mt-16 w-96 flex flex-col relative">
      <div className="flex justify-between w-full ">
        <p>{(user?.user.name ? user.user.name + "'s" : "Your") + " Library"}</p>
      </div>

      <div className="mt-12">
        <PlaylistBar />
      </div>
    </Box>
  );
}
