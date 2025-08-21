"use client";
import { Howl } from "howler";
import { ReactNode, useContext, createContext, useRef, useState } from "react";

interface AudioContextType {
  currentSong: string | null;
  isPlaying: boolean;
  playSong: (songId: string, audioFile: File) => void;
  stopSong: () => void;
  pauseSong: () => void;
  resumeSong: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const howlRef = useRef<Howl | null>(null);
  const playSong = (songId: string, audioFile: File) => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }
    const audioUrl = URL.createObjectURL(audioFile);
    const howl = new Howl({
      src: [audioUrl],
      format: ["mp3"],
      onplay: () => {
        setIsPlaying(true);
        setCurrentSong(songId);
      },
      onpause: () => {},
      onend: () => {
        URL.revokeObjectURL(audioUrl);
      },
      onloaderror: (id, error) => {
        setIsPlaying(false);
        setCurrentSong(null);
        URL.revokeObjectURL(audioUrl);
        console.error("Error loading audio:", error);
        return;
      },
      onstop: () => {
        URL.revokeObjectURL(audioUrl);
      },
    });
    howlRef.current = howl;
    howlRef.current.play();
  };
  const stopSong = () => {
    if (howlRef.current && currentSong && isPlaying) {
      howlRef.current.stop();
      howlRef.current.unload();
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };
  const pauseSong = () => {
    if (howlRef.current && currentSong && isPlaying) {
      howlRef.current.pause();
      setIsPlaying(false);
    }
  };
  const resumeSong = () => {
    if (howlRef.current && currentSong && !isPlaying) {
      howlRef.current.play();
      setIsPlaying(true);
    }
  };
  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        stopSong,
        pauseSong,
        resumeSong,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
