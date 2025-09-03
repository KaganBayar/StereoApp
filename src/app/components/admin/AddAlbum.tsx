"use client";
import { useState, useEffect } from "react";
import { Album, Artist } from "@/lib/shared/types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCalendar,
} from "react-icons/fa";
import Image from "next/image";
import {
  findAllAlbums,
  findAllArtists,
  updateAlbum,
  createAlbum,
} from "@/lib/server/dbActions";
import { AlbumFormData } from "@/lib/shared/types";
import { uploadString, ref } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import { photoUse, Loader } from "@/lib/client/firebaseActions";
import { albumImagesRef } from "../../../../config/firebase";
import { z } from "zod";
import { uploadDataUrlPhoto } from "@/lib/client/firebaseActions";
import { initialAlbum } from "@/lib/shared/initialState";

const AddAlbum = () => {
  const [parentPath, setParentPath] = useState<string>("images/albums/");

  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<string | null>(null);
  const [formData, setFormData] = useState<AlbumFormData>(initialAlbum);

  const [imagePreviewDataUrl, setImagePreviewDataUrl] = useState<string | null>(
    null
  );
  // State to store loaded album cover images from Firebase
  const [albumImagesDataUrl, setAlbumImagesDataUrl] = useState<{
    [key: string]: string;
  }>({});

  // [NEED UPDATE] dont useEffect for fetching

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        setLoading(true);

        const [albumsData, artistsData] = await Promise.all([
          findAllAlbums(),
          findAllArtists(),
        ]);
        // Load album cover images from Firebase if albums exist

        if (albumsData.length > 0) {
          const albumImages = await Loader.loadAlbumImages(albumsData);
          if (ignore) return;
          setAlbumImagesDataUrl(albumImages);
        }
        if (ignore) return;
        setAlbums(albumsData);
        setArtists(artistsData);
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
    field: keyof AlbumFormData,
    value: string | number | Date
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // When file is loaded, set preview and store Firebase path (not base64)
      reader.onloadend = () => {
        const result = reader.result as string; // Data URL for preview
        setImagePreviewDataUrl(result);
        // Store Firebase storage path instead of base64 data
        setFormData({ ...formData, photo_url: parentPath + file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // must be same as AlbumCreateFormData
    if (!formData.title || !formData.artist_id || !formData.releaseDate) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.photo_url && typeof formData.photo_url !== "string") {
      setError("Invalid photo URL format");
      return;
    }
    try {
      // Upload image to Firebase if there's a new image selected
      if (formData.photo_url && imagePreviewDataUrl) {
        await uploadDataUrlPhoto(imagePreviewDataUrl, formData.photo_url);
      }

      if (editingAlbum) {
        const updateFormData = {
          ...formData,
          releaseDate:
            typeof formData.releaseDate === "string"
              ? new Date(formData.releaseDate)
              : formData.releaseDate,
        };
        const updatedAlbum = await updateAlbum(editingAlbum, updateFormData);
        setAlbums(
          albums.map((album) =>
            album.id === editingAlbum ? updatedAlbum : album
          )
        );
        const albumImages = await Loader.loadAlbumImages(albums);
        setAlbumImagesDataUrl(albumImages);

        setEditingAlbum(null);
      } else {
        const submitData = {
          ...formData,
          releaseDate:
            typeof formData.releaseDate === "string"
              ? new Date(formData.releaseDate)
              : formData.releaseDate,
        };

        const newAlbum: Album = await createAlbum(submitData);
        // Reload album images to include the new album's image
        const albumImages = await Loader.loadAlbumImages([...albums, newAlbum]);
        setAlbumImagesDataUrl(albumImages);
        setAlbums([...albums, newAlbum]);
        setShowAddForm(false);
      }

      setFormData(initialAlbum);

      setImagePreviewDataUrl(null);
      setError(null);
    } catch (err) {
      setError("Failed to save album");
      console.error("Error saving album:", err);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album.id);

    const editFormData: AlbumFormData = {
      title: album.title,
      artist_id: album.artist_id,
      releaseDate: album.releaseDate,
      photo_url: album.photo_url,
    };

    setFormData({
      ...editFormData,
      /*releaseDate:
        album.releaseDate instanceof Date
          ? album.releaseDate.toISOString().split("T")[0]
          : new Date(album.releaseDate).toISOString().split("T")[0],
          */
    });
    // Set image preview from loaded Firebase images or fallback to stored URL
    const loadedImage = albumImagesDataUrl[album.id];
    setImagePreviewDataUrl(loadedImage || album.photo_url || null);
  };

  const handleDelete = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      setAlbums(albums.filter((album) => album.id !== albumId));
    } catch (err) {
      setError("Failed to delete album");
      console.error("Error deleting album:", err);
    }
  };

  const handleCancel = () => {
    setEditingAlbum(null);
    setShowAddForm(false);
    setFormData(initialAlbum);

    setImagePreviewDataUrl(null);
    setError(null);
  };

  const getArtistName = (artistId: string) => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name || "Unknown Artist";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Albums</div>
        <div className="text-neutral-400">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="pt-6 p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-neutral-200 text-xl">Albums ({albums.length})</div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Album
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
      )}

      {(showAddForm || editingAlbum) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingAlbum ? "Edit Album" : "Add New Album"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter album title"
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
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
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
                  Release Date *
                </label>
                <input
                  type="date"
                  value={
                    formData.releaseDate
                      ? typeof formData.releaseDate === "string"
                        ? formData.releaseDate
                        : formData.releaseDate instanceof Date
                        ? formData.releaseDate.toISOString().split("T")[0]
                        : new Date(formData.releaseDate)
                            .toISOString()
                            .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      handleInputChange("releaseDate", e.target.value);
                    } else {
                      handleInputChange("releaseDate", "");
                    }
                  }}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Album Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-purple-700"
                />
                {imagePreviewDataUrl && (
                  <div className="mt-2">
                    <Image
                      src={imagePreviewDataUrl}
                      alt="Album cover preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/64x64.png?text=Album";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingAlbum ? "Update" : "Add"} Album
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
                  Release Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {albums.map((album) => (
                <tr key={album.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={
                        albumImagesDataUrl[album.id] ||
                        "https://placehold.co/40x40.png?text=Album"
                      }
                      alt="Album cover"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/40x40.png?text=Album";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {album.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {getArtistName(album.artist_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 flex items-center gap-2">
                      <FaCalendar className="text-gray-500" />
                      {formatDate(album.releaseDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(album)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(album.id)}
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

      {albums.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No albums found</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add Your First Album
          </button>
        </div>
      )}
    </div>
  );
};

export default AddAlbum;
