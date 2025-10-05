//[UPDATE NEEDED] şarkı eklediğin zaman eklendiğini görebiliyorsun ama ekleme formu sonradan kapanıyor
"use client";
import { useState, useEffect } from "react";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist } from "@/lib/Types/artistTypes";
import { Album } from "@/lib/Types/albumTypes";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { findAllSongs } from "@/lib/server/dbActions";
import { findAllArtists } from "@/lib/server/dbActions";
import { findAllAlbums } from "@/lib/server/dbActions";
import { updateSong, createSong, deleteSong } from "@/lib/server/dbActions";
import {
  photoUse,
  songUse,
  uploadDataUrlPhoto,
  uploadFileSong,
} from "@/lib/client/firebaseActions";
import { songsRef, storage } from "@/../../config/firebase";
import { Howl, Howler } from "howler";
import { ref, uploadBytes, uploadString } from "firebase/storage";
import { getAudioDuration } from "@/lib/client/audioUtils";
import { initialSong } from "@/lib/shared/initialState";
import { Loader } from "@/lib/client/firebaseActions";

const AddSong = () => {
  const [imagePath, setImagePath] = useState<string>("images/songs/");
  const [songPath, setSongPath] = useState<string>("audio/songs/");
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState<string | null>(null);
  const [formData, setFormData] = useState<SongFormData>(initialSong);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); // not yet implemented
  const [imagePreviewDataUrl, setImagePreviewDataUrl] = useState<string | null>(
    null
  );
  const [selectedSongFile, setSelectedSongFile] = useState<File | null>(null);
  const [loadedSongFiles, setLoadedSongFiles] = useState<{
    [key: string]: File;
  }>({});
  const [songImagesDataUrl, setSongImagesDataUrl] = useState<{
    [key: string]: string;
  }>({});
  const [updatedFormData, setUpdatedFormData] = useState<Partial<SongFormData>>(
    {}
  );

  // [NEED UPDATE] dont useEffect for fetching
  //you should use diffrent effects for images and songs
  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        setLoading(true);

        const [songsData, artistsData, albumsData] = await Promise.all([
          findAllSongs(),
          findAllArtists(),
          findAllAlbums(),
        ]);

        if (songsData.length > 0) {
          const loadedSongImages = await Loader.loadSongImages(songsData);
          if (ignore) return;
          setSongImagesDataUrl(loadedSongImages);
          const loadedSongs = await Loader.loadSongs(songsData);
          setLoadedSongFiles(loadedSongs);
        }
        if (ignore) return;
        setSongs(songsData);
        setArtists(artistsData);
        setAlbums(albumsData);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error loading data:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (
    field: keyof Partial<SongFormData>,
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreviewDataUrl(result);
        setFormData({ ...formData, photo_url: imagePath + file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.album_id ||
      !formData.artist_id ||
      !formData.song_url ||
      !formData.genre ||
      !formData.releaseDate
    ) {
      setError("Please fill in all required fields (including audio file)");
      return;
    }

    if (formData.photo_url && typeof formData.photo_url !== "string") {
      setError("Invalid photo URL format");
      return;
    }
    try {
      if (formData.photo_url && imagePreviewDataUrl) {
        await uploadDataUrlPhoto(imagePreviewDataUrl, formData.photo_url);
      }
      if (formData.song_url && selectedSongFile) {
        await uploadFileSong(selectedSongFile, formData.song_url);
        formData.length = (await getAudioDuration(selectedSongFile)) || 0;
      }

      if (editingSong) {
        const updateFormData = {
          ...formData,
          releaseDate:
            typeof formData.releaseDate === "string"
              ? new Date(formData.releaseDate)
              : formData.releaseDate,
        };
        const updatedSong = await updateSong(editingSong, updateFormData);
        //all songs + newly updated song
        const songsAndNewlyUpdated: Song[] = songs.map((song) =>
          song.id === editingSong ? updatedSong : song
        );
        setSongs(songsAndNewlyUpdated);
        const songImages = await Loader.loadSongImages(songsAndNewlyUpdated);
        setSongImagesDataUrl(songImages);
        await Loader.loadSongs(songsAndNewlyUpdated);
        setEditingSong(null);
        setImagePreviewDataUrl(null);
      } else {
        const submitFormData = {
          ...formData,
          releaseDate:
            typeof formData.releaseDate === "string"
              ? new Date(formData.releaseDate)
              : formData.releaseDate,
        };
        const newSong = await createSong(submitFormData);
        setSongs([...songs, newSong]);
        const songImages = await Loader.loadSongImages([...songs, newSong]);
        setSongImagesDataUrl(songImages);
        await Loader.loadSongs([...songs, newSong]);
        setShowAddForm(false);
      }
      setFormData(initialSong);
      setSelectedSongFile(null);
      setImagePreviewDataUrl(null);
      setError(null);
    } catch (err) {
      setError("Failed to save song");
      console.error("Error saving song:", err);
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song.id);

    const editFormData: SongFormData = {
      name: song.name,
      album_id: song.album_id,
      artist_id: song.artist_id,
      song_url: song.song_url,
      genre: song.genre,
      releaseDate: song.releaseDate,
      length: song.length,
      photo_url: song.photo_url,
    };

    setFormData(editFormData);
    setImagePreviewDataUrl(songImagesDataUrl[song.id] || null);
    setSelectedImageFile(null);
  };

  const handleDelete = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      await deleteSong(songId);
      setSongs(songs.filter((song) => song.id !== songId));
    } catch (err) {
      setError("Failed to delete song");
      console.error("Error deleting song:", err);
    }
  };

  const handleCancel = () => {
    setEditingSong(null);
    setShowAddForm(false);
    setFormData(initialSong);
    setSelectedImageFile(null);
    setImagePreviewDataUrl(null);
    setSelectedSongFile(null);
    setError(null);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name || "Unknown Artist";
  };

  const getAlbumName = (albumId: string) => {
    const album = albums.find((a) => a.id === albumId);
    return album?.title || "Unknown Album";
  };
  // format daha güzel gösterir şekilde tasarla
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Songs</div>
        <div className="text-neutral-400">Loading songs...</div>
      </div>
    );
  }

  return (
    <div className="pt-6 p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-neutral-200 text-xl">Songs ({songs.length})</div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Song
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
      )}

      {(showAddForm || editingSong) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingSong ? "Edit Song" : "Add New Song"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Artist *
                </label>
                <select
                  value={formData.artist_id || ""}
                  onChange={(e) =>
                    handleInputChange("artist_id", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Album *
                </label>
                <select
                  value={formData.album_id || ""}
                  onChange={(e) =>
                    handleInputChange("album_id", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Album</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Audio File *
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedSongFile(file);
                      // Store file path reference for backend
                      handleInputChange("song_url", "audio/songs/" + file.name);
                    }
                  }}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-blue-700"
                  required
                />
                {selectedSongFile && (
                  <div className="mt-2 text-sm text-gray-300">
                    Selected: {selectedSongFile.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Genre *
                </label>
                <input
                  type="text"
                  value={formData.genre || ""}
                  onChange={(e) => handleInputChange("genre", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={
                    formData.releaseDate
                      ? new Date(formData.releaseDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("releaseDate", e.target.value)
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Song Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-green-700"
                />
                {imagePreviewDataUrl && (
                  <div className="mt-2">
                    <Image
                      src={imagePreviewDataUrl}
                      alt="Song cover preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/64x64.png?text=Song";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingSong ? "Update" : "Add"} Song
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Artist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Album
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Release Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {songs.map((song) => (
                <tr key={song.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={
                        songImagesDataUrl[song.id] ||
                        "https://placehold.co/40x40.png?text=Song"
                      }
                      alt="Song cover"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/40x40.png?text=Song";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {song.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {getArtistName(song.artist_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {getAlbumName(song.album_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatDuration(song.length)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{song.genre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(song.releaseDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {songs.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No songs found</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add Your First Song
          </button>
        </div>
      )}
    </div>
  );
};

export default AddSong;
