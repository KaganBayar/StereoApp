/*
"use client";
import { useState, useEffect, useContext } from "react";
import { Playlists } from "@/lib/types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaMusic,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";
import { createPlaylistAction, findUserPlaylists } from "@/lib/dbActions";
import UserContext, { DispatchContext } from "@/contexts/UserContext";
import { usePlaylistRefresh } from "@/contexts/playlistRefreshed";
import { useRouter } from "next/navigation";

const AddPlaylist = () => {
  const user = useContext(UserContext);
  const dispatch = useContext(DispatchContext);
  const router = useRouter();
  const refreshContext = usePlaylistRefresh();

  const [playlists, setPlaylists] = useState<Playlists[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Playlists>>({});

  useEffect(() => {
    if (user?.email) {
      loadPlaylists();
    }
  }, [user?.email]);

  const loadPlaylists = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const userPlaylists = await findUserPlaylists(user.email);
      setPlaylists(userPlaylists);
      setError(null);
    } catch (err: any) {
      if (
        err.message?.includes("UNAUTHORIZED") ||
        err.message?.includes("FORBIDDEN")
      ) {
        setError("Session expired or access denied. Please log in again.");
        // Clear user context or redirect to login
        dispatch!({ type: "LOGOUT" });
      } else {
        setError("Failed to load playlists");
      }
      console.error("Error loading playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Playlists, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setError("User not authenticated");
      return;
    }

    if (formData.photo && typeof formData.photo !== 'string') {
      setError("Invalid photo URL format");
      return;
    }

    try {
      if (editingPlaylist) {
        // Update playlist logic would go here
        setPlaylists(
          playlists.map((playlist) =>
            playlist.id === editingPlaylist
              ? { ...playlist, ...(formData as Playlists) }
              : playlist
          )
        );
        setEditingPlaylist(null);
      } else {
        // Create new playlist
        const newPlaylist = await createPlaylistAction(user.email);

        // Update the playlist with custom name/description if provided
        const updatedPlaylist = {
          ...newPlaylist,
          name: formData.name || `My Playlist ${playlists.length + 1}`,
          description: formData.description || null,
          photo:
            formData.photo ||
            "https://via.placeholder.com/300x300?text=Playlist",
          created_at: new Date(),
          user_id: user.user.id,
        };

        setPlaylists([...playlists, updatedPlaylist]);
        await refreshContext?.refreshPlaylists();
        dispatch!({
          type: "ADDPLAYLIST",
          payload: [...user!.user.playlists, updatedPlaylist],
        });
        setShowAddForm(false);
      }
      setFormData({});
      setError(null);
    } catch (err: any) {
      if (
        err.message?.includes("UNAUTHORIZED") ||
        err.message?.includes("FORBIDDEN")
      ) {
        setError("Session expired or access denied. Please log in again.");
        dispatch!({ type: "LOGOUT" });
      } else {
        setError("Failed to save playlist");
      }
      console.error("Error saving playlist:", err);
    }
  };

  const handleEdit = (playlist: Playlists) => {
    setEditingPlaylist(playlist.id);
    setFormData({
      name: playlist.name,
      description: playlist.description,
      photo: playlist.photo,
    });
  };

  const handleDelete = async (playlistId: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      // Delete playlist logic would go here
      setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
      await refreshContext?.refreshPlaylists();
      dispatch!({
        type: "REMOVEPLAYLIST",
        payload: playlistId,
      });
    } catch (err) {
      setError("Failed to delete playlist");
      console.error("Error deleting playlist:", err);
    }
  };

  const handleCancel = () => {
    setEditingPlaylist(null);
    setShowAddForm(false);
    setFormData({});
    setError(null);
  };

  const handleViewPlaylist = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
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
        <div className="text-neutral-200 text-xl mb-4">Playlists</div>
        <div className="text-neutral-400">Loading playlists...</div>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Playlists</div>
        <div className="text-neutral-400">
          Please log in to manage playlists.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-neutral-200 text-xl">
          Playlists ({playlists.length})
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Create Playlist
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
      )}

      {(showAddForm || editingPlaylist) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                  placeholder={`My Playlist ${playlists.length + 1}`}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.photo || ""}
                  onChange={(e) => handleInputChange("photo", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.photo && (
                  <div className="mt-2">
                    <Image
                      src={formData.photo}
                      alt="Playlist cover preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/64x64.png?text=Playlist";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none h-24 resize-none"
                placeholder="Tell us about your playlist..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingPlaylist ? "Update" : "Create"} Playlist
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
          >
            <div className="aspect-square relative">
              <Image
                src={
                  playlist.photo ||
                  "https://placehold.co/300x300.png?text=Playlist"
                }
                alt={playlist.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/300x300.png?text=Playlist";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleViewPlaylist(playlist.id)}
                  className="opacity-0 hover:opacity-100 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-all"
                >
                  <FaMusic />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-white font-medium text-lg mb-2 truncate">
                {playlist.name}
              </h3>

              {playlist.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {playlist.description}
                </p>
              )}

              <div className="flex items-center text-gray-500 text-xs mb-4">
                <FaUser className="mr-1" />
                <span className="mr-3">{user.user?.name || "You"}</span>
                <span>{formatDate(playlist.created_at)}</span>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewPlaylist(playlist.id)}
                  className="text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  View Playlist
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(playlist)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(playlist.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No playlists found</div>
          <p className="text-gray-500 mb-6">
            Create your first playlist to get started!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Create Your First Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPlaylist;
*/
