"use client";
import { PhotoWithFallback } from "./photoWithFallback";
import { FaPlay } from "react-icons/fa";
import { Song } from "@/lib/shared/Types/songTypes";
import { useEffect } from "react";
import { songUse } from "@/lib/client/firebaseActions";
import { useState } from "react";
import { useContext } from "react";
import { useAudio } from "@/contexts/audioContext";
import { photoUse } from "@/lib/client/firebaseActions";

export const HomePageSong = (song: Song) => {
  const [songFile, setSongFile] = useState<File | null>(null);
  const [howlFile, sethowlFile] = useState<Howl | null>(null);
  const {
    currentSong,
    songMetadata,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
  } = useAudio();
  //[UPDATE NEEDED] you shouldnt fetch in effect
  useEffect(() => {
    async function LoadSong() {
      try {
        const loadedSongFile = await songUse(song.song_url);
        setSongFile(loadedSongFile);
      } catch (error) {
        throw new Error("Failed to load song " + error);
      }
    }
    LoadSong();
  }, [song]);
  return (
    <div
      key={song.id}
      className={
        "bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer"
      }
      onClick={async () => {
        if (songFile) {
          const howl = playSong(song.id, songFile, {
            name: song.name,
            artist: song.artist.name,
            albumArt: await photoUse(song.photo_url),
          });
        } else {
          console.error("Song file not loaded");
        }
      }}
    >
      <div className="relative mb-4">
        <div className="w-full aspect-square relative">
          <PhotoWithFallback
            photoPath={song.photo_url}
            alt={song.name}
            className="w-full aspect-square"
          />
        </div>
        <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 transform">
          <FaPlay className="text-black text-sm ml-0.5" />
        </button>
      </div>
      <h3 className="font-semibold text-white mb-1 truncate">{song.name}</h3>
      <p className="text-sm text-gray-400 truncate">
        {song.artist?.name ? song.artist.name : "Unknown Artist"}
      </p>
    </div>
  );
};
