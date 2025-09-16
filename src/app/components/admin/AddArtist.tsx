"use client";
import { useState, useEffect, useCallback } from "react";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import {
  findAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "@/lib/server/dbActions";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaMusic,
} from "react-icons/fa";
import Image from "next/image";

import { musicImagesRef } from "../../../../config/firebase";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import { photoUse, Loader } from "@/lib/client/firebaseActions";
import { initialArtist } from "@/lib/shared/initialState";
import { uploadDataUrlPhoto } from "@/lib/client/firebaseActions";

const AddArtist = () => {
  const [parentPath, setParentPath] = useState<string>("images/artists/");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtistFormData>(initialArtist);
  const [imagePreviewDataUrl, setImagePreviewDataUrl] = useState<string | null>(
    null
  );
  const [artistImagesDataUrl, setArtistImagesDataUrl] = useState<{
    [key: string]: string;
  }>({});
  // [NEED UPDATE] dont useEffect for fetching
  useEffect(() => {
    let ignore = false;
    const loadArtists = async () => {
      try {
        setLoading(true);
        console.log("ArtistLoading");
        const artistsData = await findAllArtists();
        if (artistsData.length > 0) {
          const artistImages = await Loader.loadArtistImages(artistsData);
          if (ignore) return;
          setArtistImagesDataUrl(artistImages);
        }
        if (ignore) return;
        setArtists(artistsData);
        setError(null);
      } catch (err) {
        setError("Failed to load artists");
        console.error("Error loading artists:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadArtists();
    return () => {
      ignore = true;
    };
  }, []);

  //effect1

  const handleInputChange = (
    field: keyof Partial<ArtistFormData>,
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string; //Data:url
        setImagePreviewDataUrl(result);
        setFormData({ ...formData, photo_url: parentPath + file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.genre || !formData.bio) {
      setError("Please fill in all required fields");
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
      if (editingArtist) {
        // Update existing artist
        const updatedArtist = await updateArtist(editingArtist, formData);
        setArtists(
          artists.map((artist) =>
            artist.id === editingArtist ? updatedArtist : artist
          )
        );
        const artistImages = await Loader.loadArtistImages(artists);
        setArtistImagesDataUrl(artistImages);
        setEditingArtist(null);
      } else {
        // Add new artist logic
        const newArtist: Artist = await createArtist(formData);
        const artistImages = await Loader.loadArtistImages([
          ...artists,
          newArtist,
        ]);
        setArtistImagesDataUrl(artistImages);
        setArtists([...artists, newArtist]);
        setShowAddForm(false);
      }

      setFormData(initialArtist);
      setError(null);
    } catch (err) {
      setError("Failed to save artist");
      console.error("Error saving artist:", err);
    } finally {
      setImagePreviewDataUrl(null);
    }
  };

  const handleEdit = async (artist: Artist) => {
    setEditingArtist(artist.id);
    const editFormData: ArtistFormData = {
      name: artist.name,
      genre: artist.genre,
      bio: artist.bio,
      photo_url: artist.photo_url,
    };
    setFormData(editFormData);
    const photo = artistImagesDataUrl[artist.id];
    setImagePreviewDataUrl(photo || null);
  };

  const handleDelete = async (artistId: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;

    try {
      await deleteArtist(artistId);
      setArtists(artists.filter((artist) => artist.id !== artistId));
    } catch (err) {
      setError("Failed to delete artist");
      console.error("Error deleting artist:", err);
    }
  };

  const handleCancel = () => {
    setEditingArtist(null);
    setShowAddForm(false);
    setFormData(initialArtist);
    setImagePreviewDataUrl(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Artists</div>
        <div className="text-neutral-400">Loading artists...</div>
      </div>
    );
  }

  return (
    <div className="pt-6 p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-neutral-200 text-xl">
          Artists ({artists.length})
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Artist
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
      )}

      {(showAddForm || editingArtist) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingArtist ? "Edit Artist" : "Add New Artist"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Genre *
                </label>
                <input
                  type="text"
                  value={formData.genre || ""}
                  onChange={(e) => handleInputChange("genre", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g., Pop, Rock, Jazz, Classical"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-indigo-700"
                />
                {imagePreviewDataUrl && (
                  <div className="mt-2">
                    <Image
                      src={imagePreviewDataUrl}
                      alt="Artist preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/64x64.png?text=Artist";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none h-24 resize-none"
                  placeholder="Tell us about the artist..."
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingArtist ? "Update" : "Add"} Artist
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
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Bio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {artists.map((artist) => (
                <tr key={artist.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={
                        artistImagesDataUrl[artist.id] ||
                        "https://placehold.co/40x40.png?text=Artist"
                      }
                      alt="Artist"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/40x40.png?text=Artist";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMusic className="text-indigo-400 mr-3" />
                      <div className="text-sm font-medium text-white">
                        {artist.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full">
                      {artist.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {artist.bio || "No bio available"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(artist)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
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

      {artists.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No artists found</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add Your First Artist
          </button>
        </div>
      )}
    </div>
  );
};

export default AddArtist;
