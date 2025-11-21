//[NEED UPDATE AI EXAMPLE]
"use client";
import React, { useState, useRef } from "react";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Headphones,
  User,
  Album,
  List,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

/**
 * Modern Search Interface for Spotify Clone
 * Designed specifically for box component layout with existing margins
 */
const SearchPage = () => {
  // Core search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // Mock data for demonstrations
  const [recentSearches] = useState([
    "Arctic Monkeys",
    "Lofi Hip Hop",
    "Summer Hits 2024",
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Clears search and maintains focus
   */
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  /**
   * Handles search suggestion selection
   */
  const selectSuggestion = (text: string) => {
    setSearchQuery(text);
    setIsFocused(false);
  };

  /**
   * Filter categories with icons
   */
  const filters = [
    { id: "All", label: "All", icon: Search },
    { id: "Songs", label: "Songs", icon: Headphones },
    { id: "Artists", label: "Artists", icon: User },
    { id: "Albums", label: "Albums", icon: Album },
    { id: "Playlists", label: "Playlists", icon: List },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Search</h1>
        <p className="text-gray-400 mt-1">Find your next favorite song</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div
          className={`relative transition-all duration-200 ${
            isFocused ? "transform scale-[1.02]" : ""
          }`}
        >
          <div
            className={`flex items-center bg-gray-900/90 rounded-xl border-2 transition-all duration-300 ${
              isFocused
                ? "border-green-400 shadow-lg shadow-green-400/20 bg-gray-900"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            {/* Search Icon */}
            <div className="pl-4">
              <Search
                className={`transition-colors duration-300 ${
                  isFocused ? "text-green-400" : "text-gray-400"
                }`}
                size={20}
              />
            </div>

            {/* Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Songs, artists, or podcasts"
              className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-4 outline-none text-base"
            />

            {/* Clear Button */}
            {searchQuery && (
              <div className="pr-3">
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50"
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search Dropdown */}
        {isFocused && (
          <div className="absolute w-full top-full mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl z-50 overflow-hidden">
            {searchQuery ? (
              /* Search Suggestions */
              <div className="p-4">
                <button
                  onClick={() => selectSuggestion(searchQuery)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Search className="text-green-400" size={16} />
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      Search for "{searchQuery}"
                    </div>
                    <div className="text-gray-400 text-sm">
                      Find songs, artists, and more
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              /* Recent Searches */
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="text-gray-400" size={16} />
                  <span className="text-gray-300 font-medium text-sm">
                    Recent searches
                  </span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(search)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <Clock
                        className="text-gray-500 flex-shrink-0"
                        size={16}
                      />
                      <span className="text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-white text-black shadow-lg"
                  : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              }`}
            >
              <IconComponent size={16} />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {searchQuery && !isFocused ? (
        /* Search Results State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <Search className="text-gray-400" size={28} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Searching for "{searchQuery}"
          </h3>
          <p className="text-gray-400 max-w-sm">
            Your search results will appear here once you implement the search
            functionality.
          </p>
        </div>
      ) : !searchQuery && !isFocused ? (
        /* Browse All Section */
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Made For You",
                bg: "bg-gradient-to-br from-purple-600 to-blue-500",
              },
              {
                name: "Charts",
                bg: "bg-gradient-to-br from-red-500 to-orange-400",
              },
              {
                name: "New Releases",
                bg: "bg-gradient-to-br from-green-500 to-emerald-400",
              },
              {
                name: "Discover",
                bg: "bg-gradient-to-br from-pink-500 to-rose-400",
              },
              {
                name: "Concerts",
                bg: "bg-gradient-to-br from-indigo-500 to-purple-400",
              },
              {
                name: "Pop",
                bg: "bg-gradient-to-br from-yellow-500 to-orange-400",
              },
              {
                name: "Hip-Hop",
                bg: "bg-gradient-to-br from-red-600 to-pink-500",
              },
              {
                name: "Rock",
                bg: "bg-gradient-to-br from-gray-600 to-gray-800",
              },
              {
                name: "Mood",
                bg: "bg-gradient-to-br from-blue-500 to-cyan-400",
              },
              {
                name: "Indie",
                bg: "bg-gradient-to-br from-teal-500 to-green-400",
              },
              {
                name: "Workout",
                bg: "bg-gradient-to-br from-orange-500 to-red-400",
              },
              {
                name: "Chill",
                bg: "bg-gradient-to-br from-blue-400 to-indigo-500",
              },
            ].map((category, index) => (
              <button
                key={index}
                className={`${category.bg} relative h-32 rounded-xl p-4 text-left overflow-hidden group hover:scale-105 transition-transform duration-200 shadow-lg`}
              >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-200" />

                {/* Category text */}
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 opacity-30 transform rotate-12">
                  <div className="w-16 h-16 bg-white/20 rounded-lg" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;
