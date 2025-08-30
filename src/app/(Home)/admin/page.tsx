"use client";

import Box from "@/app/components/misc/Box";
import UserAdmin from "@/app/components/admin/UserAdmin";
import { useState } from "react";
import AddSong from "@/app/components/admin/AddSong";
import AddAlbum from "@/app/components/admin/AddAlbum";
import AddArtist from "@/app/components/admin/AddArtist";
export default function Home() {
  const [showWhichPanel, setShowWhichPanel] = useState<
    "userList" | "addSong" | "addAlbum" | "addArtist"
  >("userList");

  return (
    <div className="items-center flex flex-col w-full">
      <Box className="flex w-[100%]">
        <div className="space-x-4 flex flex-row w-full justify-around">
          <button
            onClick={() => {
              setShowWhichPanel("userList");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            User List
          </button>
          <button
            onClick={() => {
              setShowWhichPanel("addSong");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Song
          </button>
          <button
            onClick={() => {
              setShowWhichPanel("addAlbum");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Album
          </button>
          <button
            onClick={() => {
              setShowWhichPanel("addArtist");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
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
