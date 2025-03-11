"use client";

import React, { useEffect, useState } from "react";
import { findUserPlaylists } from "@/lib/actions";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { Playlists as PlaylistType } from "@/lib/types";
import Link from "next/link";

export default function PlaylistBar() {
  const user = useContext(UserContext);
  const [playlist, setPlaylist] = useState<PlaylistType[]>([]);
  const email = user?.user.email;

  //
  useEffect(() => {
    if (email) {
      findUserPlaylists(user.user.email).then((playlists) => {
        setPlaylist(playlists);
      });
    }
  }, [email]);
  console.log(playlist);

  return (
    <div className="mb-4">
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
