"use client";

import React from "react";
import { useAudio } from "@/contexts/audioContext";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  SkipBack,
  SkipForward,
  Shuffle,
} from "lucide-react";
import Image from "next/image";

const MusicPlayer = () => {
  const {
    songMetadata,
    isPlaying,
    muteVolume,
    currentTime,
    duration,
    volume,
    isLooping,
    pauseSong,
    resumeSong,
    seekTo,
    setVolume,
    toggleLoop,
  } = useAudio();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!songMetadata) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f2e] border-t border-slate-700/50 p-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-6">
          {/* Song Info */}
          <div className="flex items-center gap-4 min-w-0 w-80">
            <div className="flex-shrink-0">
              {songMetadata.albumArt ? (
                <div className="w-16 h-16 rounded-md overflow-hidden shadow-lg">
                  <Image
                    src={songMetadata.albumArt}
                    alt={songMetadata.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-700/50 rounded-md flex items-center justify-center shadow-lg">
                  <div className="w-8 h-8 bg-slate-500/30 rounded"></div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate text-white">
                {songMetadata.name}
              </h3>
              <p className="text-sm text-slate-400 truncate">
                {songMetadata.artist}
              </p>
            </div>
          </div>

          {/* Player Controls - Centered */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
                disabled
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
                disabled
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-white hover:bg-gray-100 text-black rounded-full shadow-lg transition-all hover:scale-105"
                onClick={isPlaying ? pauseSong : resumeSong}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
                disabled
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-700/50 transition-all"
                onClick={toggleLoop}
              >
                <Repeat
                  className={`h-4 w-4 ${
                    isLooping
                      ? "text-green-400 hover:text-green-300"
                      : "text-slate-400 hover:text-slate-200"
                  } transition-colors`}
                />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <span className="text-xs text-slate-400 min-w-[35px] text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&>.relative>.absolute]:bg-white [&>.relative]:bg-slate-600"
                />
              </div>
              <span className="text-xs text-slate-400 min-w-[35px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
              onClick={() => muteVolume()}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&>.relative>.absolute]:bg-white [&>.relative]:bg-slate-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
