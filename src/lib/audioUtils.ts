/*import { Howl } from "howler";

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Howl({
      src: [URL.createObjectURL(file)],
      format: ["mp3"],
      onload: () => {
        resolve(Math.floor(audio.duration()));
      },
      onloaderror: (error) => {
        reject(error);
      },
    });
  });
}

export function playSong(file: File): Howl {
  try {
    const audio = new Howl({
      src: [URL.createObjectURL(file)],
      format: ["mp3"],
    });
    console.log("audio state " + audio.state());
    audio.play();
    audio.on("end", () => {
      audio.stop();
      console.log("Audio unloaded");
    });
    return audio;
  } catch (error) {
    console.error("Error playing song:", error);
    throw error;
  }
}
*/
