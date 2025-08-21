"use client";
import { Howl } from "howler";
import {
  ReactNode,
  useContext,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";

interface AudioContextType {
  currentSong: string | null;
  songMetadata: SongMetadata | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  playSong: (songId: string, audioFile: File, metadata?: SongMetadata) => void;
  stopSong: () => void;
  pauseSong: () => void;
  resumeSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
}

interface SongMetadata {
  name: string;
  artist: string;
  albumArt?: string;
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
  const [songMetadata, setSongMetadata] = useState<SongMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (howlRef.current && isPlaying) {
        setCurrentTime(howlRef.current.seek() as number);
      }
    }, 1000);
  };

  const stopTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playSong = (
    songId: string,
    audioFile: File,
    metadata?: SongMetadata
  ) => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      stopTimeUpdate();
    }
    const audioUrl = URL.createObjectURL(audioFile);
    const howl = new Howl({
      src: [audioUrl],
      format: ["mp3", "wav", "ogg"],
      loop: isLooping,
      volume: volume,
      onload: () => {
        setDuration(howl.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        setCurrentSong(songId);
        setSongMetadata(metadata || null);
        startTimeUpdate();
      },

      onpause: () => {
        setIsPlaying(false);
        stopTimeUpdate();
      },
      onend: () => {
        if (!isLooping) {
          setIsPlaying(false);
          setCurrentTime(0);
          stopTimeUpdate();
        }
        URL.revokeObjectURL(audioUrl);
      },
      onloaderror: (id, error) => {
        setIsPlaying(false);
        setCurrentSong(null);
        setSongMetadata(null);
        URL.revokeObjectURL(audioUrl);
        console.error("Error loading audio:", error);
        return;
      },

      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
        stopTimeUpdate();
        URL.revokeObjectURL(audioUrl);
      },
    });
    howlRef.current = howl;
    howlRef.current.play();
  };

  const stopSong = () => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      setIsPlaying(false);
      setCurrentSong(null);
      setSongMetadata(null);
      setCurrentTime(0);
      setDuration(0);
      stopTimeUpdate();
    }
  };

  const pauseSong = () => {
    if (howlRef.current && isPlaying) {
      howlRef.current.pause();
      setIsPlaying(false);
      stopTimeUpdate();
    }
  };

  const resumeSong = () => {
    if (howlRef.current && !isPlaying) {
      howlRef.current.play();
      setIsPlaying(true);
      startTimeUpdate();
    }
  };

  const seekTo = (time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (howlRef.current) {
      howlRef.current.volume(clampedVolume);
    }
  };

  const toggleLoop = () => {
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    if (howlRef.current) {
      howlRef.current.loop(newLoopState);
    }
  };
  return (
    <AudioContext.Provider
      value={{
        currentSong,
        songMetadata,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLooping,
        playSong,
        stopSong,
        pauseSong,
        resumeSong,
        seekTo,
        setVolume,
        toggleLoop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
