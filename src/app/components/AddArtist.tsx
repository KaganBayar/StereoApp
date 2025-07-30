"use client";
import { useState, useEffect } from "react";
import { Artist } from "@/lib/types";
import {
  findAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "@/lib/dbActions";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaMusic,
} from "react-icons/fa";
import { ArtistCreateFormData, ArtistUpdateFormData } from "@/lib/types";

const AddAuthor = () => {
  const [authors, setAuthors] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtistUpdateFormData>({});
  // name: string |genre: string; bio | string; photo_url | string;

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const authorsData = await findAllAuthors();
      setAuthors(authorsData);
      setError(null);
    } catch (err) {
      setError("Failed to load authors");
      console.error("Error loading authors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ArtistUpdateFormData,
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //cover ve bio frontende implemente edildiği zaman onları da ekle
    if (!formData.name || !formData.genre) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingAuthor) {
        const updatedAuthor = await updateAuthor(editingAuthor, {
          name: formData.name!,
          genre: formData.genre!,
        });
        setAuthors(
          authors.map((author) =>
            author.id === editingAuthor ? updatedAuthor : author
          )
        );
        setEditingAuthor(null);
      } else {
        // Add new author logic
        const newAuthor = await createAuthor(formData as ArtistCreateFormData);
        setAuthors([...authors, newAuthor]);
        setShowAddForm(false);
      }
      setFormData({});
      setError(null);
    } catch (err) {
      setError("Failed to save author");
      console.error("Error saving author:", err);
    }
  };

  const handleEdit = (author: Artist) => {
    setEditingAuthor(author.id);
    setFormData(author);
  };

  const handleDelete = async (authorId: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;

    try {
      await deleteAuthor(authorId);
      setAuthors(authors.filter((author) => author.id !== authorId));
    } catch (err) {
      setError("Failed to delete author");
      console.error("Error deleting author:", err);
    }
  };

  const handleCancel = () => {
    setEditingAuthor(null);
    setShowAddForm(false);
    setFormData({});
    setError(null);
  };

  if (loading) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Authors</div>
        <div className="text-neutral-400">Loading authors...</div>
      </div>
    );
  }

  return (
    <div className="pt-6 p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-neutral-200 text-xl">
          Authors ({authors.length})
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Author
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">{error}</div>
      )}

      {(showAddForm || editingAuthor) && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-white text-lg mb-4">
            {editingAuthor ? "Edit Author" : "Add New Author"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter author name"
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
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <FaSave /> {editingAuthor ? "Update" : "Add"} Author
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {authors.map((author) => (
                <tr key={author.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMusic className="text-indigo-400 mr-3" />
                      <div className="text-sm font-medium text-white">
                        {author.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full">
                      {author.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
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

      {authors.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No authors found</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add Your First Author
          </button>
        </div>
      )}
    </div>
  );
};

export default AddAuthor;
