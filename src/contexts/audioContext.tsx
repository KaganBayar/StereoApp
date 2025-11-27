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
  isMuted: boolean;
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
  muteVolume: () => void;
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
  const [prevVolume, setPrevVolumeState] = useState<number>(0); //private
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
      }
    };
  }, []);

  const startTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (howlRef.current) {
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
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const audioUrl = URL.createObjectURL(audioFile);
    objectUrlRef.current = audioUrl;
    const howl = new Howl({
      src: [objectUrlRef.current],
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
      onmute: () => {
        setVolumeState(0);
        setIsMuted(true);
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

  const muteVolume = () => {
    if (howlRef.current && isMuted) {
      howlRef.current.volume(prevVolume);
      setVolumeState(prevVolume);
      setIsMuted(false);
    } else if (howlRef.current) {
      setPrevVolumeState(volume);
      howlRef.current.volume(0);
      setVolumeState(0);
      setIsMuted(true);
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
        isMuted,
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
        muteVolume,
        toggleLoop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
