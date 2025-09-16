"use client";
import React, { use, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Download,
  Share,
} from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { Playlist, PlaylistSong } from "@/lib/Types/playlistTypes";
import { initialPlaylist } from "@/lib/shared/initialState";
import { findPlaylistById } from "@/lib/server/dbActions";
import { useRef } from "react";
import { photoUse } from "@/lib/client/firebaseActions";

type PagePlaylist = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  totalSongs: number;
  totalDuration: string;
  isFollowed: boolean;
  photo_url: string;
};

export default function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usedParams = React.use(params);
  const [playlistDetails, setPlaylistDetails] =
    React.useState<PagePlaylist>(initialPlaylist);
  const [tracks, setTracks] = React.useState<PlaylistSong[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + "hr." : ""} ${
      minutes > 0 ? minutes + "min." : ""
    } ${remainingSeconds > 0 ? remainingSeconds + "sec." : ""}`;
  };

  /*
  useEffect(() => {
    let ignore = false;
    findPlaylistById(usedParams.id).then((data) => {
      if (data) {
        if (ignore) return;

        if (data.photo_url) {
          try {
            photoUse(data.photo_url).then((url) => {
              setImage(url);
            });
          } catch (error) {
            console.error("Error fetching photo:", error);
          }
        }

        setTracks(data.playlistSongs);

     
        setPlaylistDetails({
          id: data.id,
          name: data.name,
          description: data.description || "This is a playlist",
          user_id: data.user_id,
          totalSongs: length,
          totalDuration: formatDuration(totalDuration),
          isFollowed: false,
          photo_url: data.photo_url,
        });

        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Playlist not found" + usedParams.id);
      }
    });
    return () => {
      ignore = true;
    };
  }, [usedParams.id]);
  */

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full overflow-hidden">
      {/* Header Section */}
      <div className="-m-4 mb-0 pt-4 px-4">
        <div className="flex items-end gap-6 p-4 pb-6">
          {/* Playlist Cover */}
          <div className="flex-shrink-0">
            {playlistDetails.photo_url && image ? (
              <Image
                src={image}
                alt={playlistDetails.name}
                width={280}
                height={280}
                className="rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-70 h-70 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center">
                <div className="text-white text-8xl font-bold">
                  {playlistDetails.name.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex flex-col justify-end min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-300 mb-2">PLAYLIST</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 truncate text-white">
              {playlistDetails.name}
            </h1>
            {playlistDetails.description && (
              <p className="text-gray-300 mb-3 text-sm">
                {playlistDetails.description}
              </p>
            )}
            <div className="flex items-center text-sm text-gray-400">
              <span className="font-semibold text-white">
                {playlistDetails.user_id}
              </span>
              <span className="mx-2">•</span>
              <span>{playlistDetails.totalSongs} songs</span>
              <span className="mx-2">•</span>
              <span>{playlistDetails.totalDuration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-6">
          <Button className="bg-green-500 hover:bg-green-400 text-black rounded-full h-12 w-12 p-0 shadow-lg hover:scale-105 transition-all">
            <Play className="h-5 w-5 fill-current ml-1" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <Download className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <Share className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-4 pb-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-600/50 mb-4">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-4">ALBUM</div>
          <div className="col-span-2 flex items-center justify-end gap-2">
            <div className="min-w-8 min-h-8"></div>
            <div className="text-sm text-gray-400 min-w-[40px] gap-2 flex items-center  justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <div className="min-w-8 min-h-8"></div>
          </div>
        </div>

        {/* Track Rows */}
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-700/50 group transition-colors cursor-pointer"
            >
              {/* Track Number / Play Button */}
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-gray-400 text-sm group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hidden group-hover:flex text-white hover:bg-transparent"
                >
                  <FaPlay className="h-3 w-3" />
                </Button>
              </div>

              {/* Title and Artist */}
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">
                  {track.song.photo_url && image ? (
                    <Image
                      src={image}
                      alt={track.song.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700/50 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-600/50 rounded"></div>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate hover:underline">
                    {track.song.name}
                  </p>
                  <p className="text-sm text-gray-400 truncate hover:underline hover:text-white">
                    {track.song.artist.name}
                  </p>
                </div>
              </div>

              {/* Album */}
              <div className="col-span-4 flex items-center">
                <p className="text-sm text-gray-400 truncate hover:underline hover:text-white">
                  {track.song.album.title}
                </p>
              </div>

              {/* Duration and More Options */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-w-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-400 min-w-[40px] text-right">
                  {track.song.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 min-w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
