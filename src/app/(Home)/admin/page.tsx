"use client";

import Box from "@/app/components/Box";
import UserAdmin from "@/app/components/UserAdmin";
import { useState } from "react";
export default function Home() {
  const [showWhichPanel, setShowWhichPanel] = useState<
    "userList" | "addSong" | "addAlbum" | "addArtist"
  >("userList");

  return (
    <div className="items-center flex flex-col">
      <Box className="flex w-[50%]">
        <div className="space-x-4 flex flex-row w-full justify-around">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            User List
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Song
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Album
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Artist
          </button>
        </div>
      </Box>
      {showWhichPanel == "userList" ? <UserAdmin /> : ""}
      {showWhichPanel == "addSong" ? <AddSong /> : ""}
      {showWhichPanel == "addAlbum" ? <AddAlbum /> : ""}
      {showWhichPanel == "addArtist" ? <AddArtist /> : ""}
    </div>
  );
}
