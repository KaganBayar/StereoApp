import { FaPlay, FaHeart, FaEllipsisH } from "react-icons/fa";
import { MdAlbum } from "react-icons/md";
import { Songs, Albums } from "@/lib/shared/types";
import { findAllSongs, findAllAlbums } from "@/lib/server/dbActions";
import { loadSongs, photoUse } from "@/lib/client/firebaseActions";
import Image from "next/image";
import { HomePageSong } from "../components/HomePageSong";
import { PhotoWithFallback } from "../components/photoWithFallback";

export default async function Home() {
  const songs = await findAllSongs();
  const albums = await findAllAlbums();

  return (
    <div className="space-y-8 w-full h-full">
      {/* Songs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-200">
            Recently Played
          </h2>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.slice(0, 8).map((song) => (
            <HomePageSong key={song.id} {...song} />
          ))}
        </div>
      </div>

      {/* Albums Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-200">
            Popular Albums
          </h2>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {albums.slice(0, 6).map((album) => (
            <div
              key={album.id}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square relative">
                  <PhotoWithFallback
                    photoPath={album.cover_url}
                    alt={album.title}
                    className="w-full aspect-square"
                  />
                </div>
                <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 transform">
                  <FaPlay className="text-black text-sm ml-0.5" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">
                {album.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">Artist</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
