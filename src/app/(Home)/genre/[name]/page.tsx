"use client";
import React, { useState, use } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  User,
  Music,
  Album,
  Filter,
  ChevronRight
} from "lucide-react";

/**
 * Dynamic Genre Page Component for Spotify Clone
 * Displays albums, artists, and songs for a specific genre
 * Optimized for box component layout
 */
export default function GenrePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const [activeSection, setActiveSection] = useState("all");

  // Decode the genre name from URL
  const genreName = decodeURIComponent(name).replace(/-/g, " ");
  const capitalizedGenre = genreName.charAt(0).toUpperCase() + genreName.slice(1);

  /**
   * Mock data for demonstration - replace with actual API calls
   */
  const mockData = {
    // Popular artists in this genre
    artists: [
      {
        id: 1,
        name: "Arctic Monkeys",
        image: "/api/placeholder/200/200",
        followers: "12M followers",
        isFollowing: false
      },
      {
        id: 2,
        name: "The Strokes",
        image: "/api/placeholder/200/200",
        followers: "8M followers",
        isFollowing: true
      },
      {
        id: 3,
        name: "Tame Impala",
        image: "/api/placeholder/200/200",
        followers: "9M followers",
        isFollowing: false
      },
      {
        id: 4,
        name: "Mac DeMarco",
        image: "/api/placeholder/200/200",
        followers: "3M followers",
        isFollowing: false
      }
    ],
    // Popular albums in this genre
    albums: [
      {
        id: 1,
        title: "AM",
        artist: "Arctic Monkeys",
        image: "/api/placeholder/300/300",
        year: "2013",
        type: "Album"
      },
      {
        id: 2,
        title: "Is This It",
        artist: "The Strokes",
        image: "/api/placeholder/300/300",
        year: "2001",
        type: "Album"
      },
      {
        id: 3,
        title: "Currents",
        artist: "Tame Impala",
        image: "/api/placeholder/300/300",
        year: "2015",
        type: "Album"
      },
      {
        id: 4,
        title: "Salad Days",
        artist: "Mac DeMarco",
        image: "/api/placeholder/300/300",
        year: "2014",
        type: "Album"
      }
    ],
    // Popular songs in this genre
    songs: [
      {
        id: 1,
        title: "Do I Wanna Know?",
        artist: "Arctic Monkeys",
        album: "AM",
        duration: "4:32",
        image: "/api/placeholder/64/64",
        isLiked: true
      },
      {
        id: 2,
        title: "Last Nite",
        artist: "The Strokes",
        album: "Is This It",
        duration: "3:17",
        image: "/api/placeholder/64/64",
        isLiked: false
      },
      {
        id: 3,
        title: "The Less I Know The Better",
        artist: "Tame Impala",
        album: "Currents",
        duration: "3:36",
        image: "/api/placeholder/64/64",
        isLiked: true
      },
      {
        id: 4,
        title: "Salad Days",
        artist: "Mac DeMarco",
        album: "Salad Days",
        duration: "2:54",
        image: "/api/placeholder/64/64",
        isLiked: false
      },
      {
        id: 5,
        title: "R U Mine?",
        artist: "Arctic Monkeys",
        album: "AM",
        duration: "3:21",
        image: "/api/placeholder/64/64",
        isLiked: true
      }
    ]
  };

  /**
   * Section filter options
   */
  const sections = [
    { id: "all", label: "All", icon: Music },
    { id: "artists", label: "Artists", icon: User },
    { id: "albums", label: "Albums", icon: Album },
    { id: "songs", label: "Songs", icon: Music }
  ];

  return (
    <div className="space-y-6">
      {/* Genre Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {capitalizedGenre}
          </h1>
          <p className="text-gray-400 mt-2">
            Discover the best {genreName} music, artists, and albums
          </p>
        </div>

        {/* Play All Button */}
        <div className="flex items-center gap-4">
          <Button className="bg-green-500 hover:bg-green-400 text-black rounded-full h-14 w-14 p-0 shadow-lg hover:scale-105 transition-all">
            <Play className="h-6 w-6 fill-current ml-1" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <Heart className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Section Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-white text-black shadow-lg"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              }`}
            >
              <IconComponent size={16} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="space-y-8">

        {/* Popular Artists Section */}
        {(activeSection === "all" || activeSection === "artists") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Popular {genreName} artists</h2>
              {activeSection === "all" && (
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white text-sm font-medium"
                  onClick={() => setActiveSection("artists")}
                >
                  Show all
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockData.artists.slice(0, activeSection === "all" ? 4 : undefined).map((artist) => (
                <div
                  key={artist.id}
                  className="bg-gray-800/30 hover:bg-gray-700/50 p-4 rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="text-white" size={32} />
                      </div>
                    </div>
                    <Button
                      className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 text-black rounded-full h-10 w-10 p-0 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold truncate mb-1">
                      {artist.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {artist.followers}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Albums Section */}
        {(activeSection === "all" || activeSection === "albums") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Popular {genreName} albums</h2>
              {activeSection === "all" && (
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white text-sm font-medium"
                  onClick={() => setActiveSection("albums")}
                >
                  Show all
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockData.albums.slice(0, activeSection === "all" ? 4 : undefined).map((album) => (
                <div
                  key={album.id}
                  className="bg-gray-800/30 hover:bg-gray-700/50 p-4 rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square bg-gray-700/50 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Album className="text-white" size={32} />
                      </div>
                    </div>
                    <Button
                      className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 text-black rounded-full h-10 w-10 p-0 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                    >
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold truncate mb-1">
                      {album.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {album.year} • {album.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Songs Section */}
        {(activeSection === "all" || activeSection === "songs") && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Popular {genreName} songs</h2>
              {activeSection === "all" && (
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white text-sm font-medium"
                  onClick={() => setActiveSection("songs")}
                >
                  Show all
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>

            {/* Songs Table Header - Only show when viewing songs section */}
            {activeSection === "songs" && (
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-600/50 mb-4">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-6">TITLE</div>
                <div className="col-span-3">ALBUM</div>
                <div className="col-span-2 flex items-center justify-end">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
            )}

            {/* Songs List */}
            <div className="space-y-1">
              {mockData.songs.slice(0, activeSection === "all" ? 5 : undefined).map((song, index) => (
                <div
                  key={song.id}
                  className={`${
                    activeSection === "songs"
                      ? "grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-700/50 group transition-colors cursor-pointer"
                      : "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/50 group transition-colors cursor-pointer"
                  }`}
                >
                  {activeSection === "songs" ? (
                    <>
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
                          <Play className="h-3 w-3 fill-current" />
                        </Button>
                      </div>

                      {/* Title and Artist */}
                      <div className="col-span-6 flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-700/50 rounded flex items-center justify-center">
                            <Music className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">
                            {song.title}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      {/* Album */}
                      <div className="col-span-3 flex items-center">
                        <p className="text-sm text-gray-400 truncate">
                          {song.album}
                        </p>
                      </div>

                      {/* Duration and Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                        >
                          <Heart className={`h-4 w-4 ${song.isLiked ? "fill-green-500 text-green-500" : ""}`} />
                        </Button>
                        <span className="text-sm text-gray-400 min-w-[40px] text-right">
                          {song.duration}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Compact Song Layout for "All" View */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-700/50 rounded flex items-center justify-center relative group">
                          <Music className="w-5 h-5 text-gray-400 group-hover:hidden" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 hidden group-hover:flex text-white hover:bg-transparent absolute inset-0 m-auto"
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {song.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {song.artist} • {song.album}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                        >
                          <Heart className={`h-4 w-4 ${song.isLiked ? "fill-green-500 text-green-500" : ""}`} />
                        </Button>
                        <span className="text-sm text-gray-400">
                          {song.duration}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
