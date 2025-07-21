"use client";

import React, { useCallback, useEffect, useState } from "react";
import { findUserPlaylists } from "@/lib/dbActions";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { Playlists as PlaylistType } from "@/lib/types";
import Link from "next/link";
import { AddPlaylistButton } from "@/app/components/AddPlaylistButton";
import { PlaylistRefreshProvider } from "@/contexts/playlistRefreshed";

export default function PlaylistBar() {
  const user = useContext(UserContext);
  const [playlist, setPlaylist] = useState<PlaylistType[]>([]);

  const refreshPlaylists = useCallback(async () => {
    if (user.email) {
      console.log("Manually refreshing playlists");
      const playlists = await findUserPlaylists(user.email);
      console.log("Playlists fetched:", playlists);
      setPlaylist(playlists);
    } else {
      setPlaylist([]);
    }
  }, [user.email]);

  useEffect(() => {
    refreshPlaylists();
  }, [user.email, refreshPlaylists]);

  return (
    <PlaylistRefreshProvider refreshFunction={refreshPlaylists}>
      <div className="mb-4">
        <div className="absolute top-3 right-8">
          {user.id ? <AddPlaylistButton /> : <></>}
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
    </PlaylistRefreshProvider>
  );
}
