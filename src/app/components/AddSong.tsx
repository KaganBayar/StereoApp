"use client";
import { useState, useEffect } from "react";
import { Song, Artist, Album } from "@/lib/types";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const AddSong = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSong, setEditingSong] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Song>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load songs, artists, and albums
      // These functions would need to be implemented in dbActions
      // const [songsData, artistsData, albumsData] = await Promise.all([
      //   findAllSongs(),
      //   findAllArtists(),
      //   findAllAlbums()
      // ]);
      // setSongs(songsData);
      // setArtists(artistsData);
      // setAlbums(albumsData);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Song, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artistId || !formData.albumId || !formData.duration) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingSong) {
        // Update song logic
        setSongs(songs.map(song => 
          song.id === editingSong 
            ? { ...song, ...formData as Song }
            : song
        ));
        setEditingSong(null);
      } else {
        // Add new song logic
        const newSong: Song = {
          id: Date.now(), // Temporary ID
          title: formData.title!,
          artistId: formData.artistId!,
          albumId: formData.albumId!,
          duration: formData.duration!
        };
        setSongs([...songs, newSong]);
        setShowAddForm(false);
      }
      setFormData({});
      setError(null);
    } catch (err) {
      setError("Failed to save song");
      console.error("Error saving song:", err);
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song.id);
    setFormData(song);
  };

  const handleDelete = async (songId: number) => {
    if (!confirm("Are you sure you want to delete this song?")) return;
    
    try {
      setSongs(songs.filter(song => song.id !== songId));
    } catch (err) {
      setError("Failed to delete song");
      console.error("Error deleting song:", err);
    }
  };

  const handleCancel = () => {
    setEditingSong(null);
    setShowAddForm(false);
    setFormData({});
    setError(null);
  };

  const getArtistName = (artistId: number) => {
    const artist = artists.find(a => a.id === artistId);
    return artist?.name || 'Unknown Artist';
  };

  const getAlbumName = (albumId: number) => {
    const album = albums.find(a => a.id === albumId);
    return album?.title || 'Unknown Album';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <div className="pt-6 p-4">
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
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      {(showAddForm || editingSong) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingSong ? 'Edit Song' : 'Add New Song'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Artist *
                </label>
                <select
                  value={formData.artistId || ''}
                  onChange={(e) => handleInputChange('artistId', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map(artist => (
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
                  value={formData.albumId || ''}
                  onChange={(e) => handleInputChange('albumId', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Album</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Duration (seconds) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingSong ? 'Update' : 'Add'} Song
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Artist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Album</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {songs.map((song) => (
                <tr key={song.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{song.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{getArtistName(song.artistId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{getAlbumName(song.albumId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatDuration(song.duration)}</div>
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
