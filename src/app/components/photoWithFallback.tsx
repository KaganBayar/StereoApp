"use client";
import { photoUse } from "@/lib/client/firebaseActions";
import { useEffect, useState } from "react";
import { MdAlbum } from "react-icons/md";
import Image from "next/image";
export function PhotoWithFallback({
  photoPath,
  alt,
  className,
}: {
  photoPath?: string;
  alt: string;
  className: string;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //you should confirm if var a's value chanegd between fetches it should use new value of var a. also you shouldnt fetch in effect
  useEffect(() => {
    if (photoPath) {
      photoUse(photoPath)
        .then((base64Image) => {
          setImageSrc(base64Image);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading photo:", err);
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(true);
    }
  }, [photoPath]);

  if (loading) {
    return (
      <div
        className={`${className} bg-gray-600 rounded-lg flex items-center justify-center animate-pulse`}
      >
        <MdAlbum className="text-4xl text-gray-400" />
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div
        className={`${className} bg-gray-600 rounded-lg flex items-center justify-center`}
      >
        <MdAlbum className="text-4xl text-gray-400" />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover rounded-lg"
      onError={() => setError(true)}
    />
  );
}
