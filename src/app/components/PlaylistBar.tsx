"use client";

import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "@/lib/server/layers/actions/playlistActions";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { Playlist as PlaylistType } from "@/lib/Types/playlistTypes";
import Link from "next/link";
import { AddPlaylistButton } from "./AddPlaylistButton";
import { checkUser } from "@/lib/client/utils";

export default function PlaylistBar() {
  console.log("playlistBar rendered");
  const user = useContext(UserContext);
  const [playlist, setPlaylist] = useState<PlaylistType[]>([]);

  useEffect(() => {
    let ignore = false;
    if (user) {
      console.log("playlistBar Fetch");
      getUserPlaylists(user.id).then((playlists) => {
        if (!ignore) {
          setPlaylist(playlists);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [user]);
  console.log(playlist);

  return (
    <div className="mb-4">
      <div className="absolute top-3 right-8">
        {checkUser(user) ? <AddPlaylistButton /> : <></>}
      </div>
      <div>
        {playlist.map((playlist, index) => {
          return (
            <li key={index} className="flex mt-2 justify-between">
              <Link href={`/playlist/${playlist.id}`}> {playlist.name} </Link>
            </li>
          );
        })}
      </div>
    </div>
  );
}
