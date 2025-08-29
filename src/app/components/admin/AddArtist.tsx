"use client";
import { useState, useEffect, useCallback } from "react";
import { Artist } from "@/lib/shared/types";
import {
  findAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
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
import { ArtistCreateFormData, ArtistUpdateFormData } from "@/lib/shared/types";
import { musicImagesRef } from "../../../../config/firebase";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import { photoUse, loadAuthorImages } from "@/lib/client/firebaseActions";

const AddAuthor = () => {
  const [authors, setAuthors] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtistUpdateFormData>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImages, setAuthorImages] = useState<{ [key: string]: string }>(
    {}
  );

  // name: string |genre: string; bio | string; photo_url | string;
  //you should confirm if var a's value chanegd between fetches it should use new value of var a. also you shouldnt fetch in effect
  useEffect(() => {
    async function loadData() {
      await loadAuthors();
    }
    loadData();
  }, []);

  //effect1
  const loadAuthors = async () => {
    try {
      setLoading(true);
      console.log("AuthorLoading");
      const authorsData = await findAllAuthors();
      setAuthors(authorsData);
      if (authorsData.length > 0) {
        const authorImages = await loadAuthorImages(authorsData);
        setAuthorImages(authorImages);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load authors");
      console.error("Error loading authors:", err);
    } finally {
      setLoading(false);
    }
  };

  //effect2

  const handleInputChange = (
    field: keyof ArtistUpdateFormData,
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
        setImagePreview(result);
        setFormData({ ...formData, photo_url: "images/artists/" + file.name });
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
      if (formData.photo_url && imagePreview) {
        const imageRef = ref(storage, formData.photo_url);
        //convert Data:url to base64
        const base64 = imagePreview.split(",")[1];
        // Upload image to Firebase
        const snapshot = await uploadString(imageRef, base64, "base64");
      }
      if (editingAuthor) {
        // Update existing author
        const updatedAuthor = await updateAuthor(editingAuthor, {
          name: formData?.name,
          genre: formData?.genre,
          bio: formData?.bio,
          photo_url: formData?.photo_url,
        });
        await loadAuthorImages([...authors, updatedAuthor]);
        //Update frontend
        setAuthors(
          authors.map((author) =>
            author.id === editingAuthor ? updatedAuthor : author
          )
        );
        setEditingAuthor(null);
      } else {
        // Add new author logic
        const newAuthor = await createAuthor(formData as ArtistCreateFormData);
        await loadAuthorImages([...authors, newAuthor]);
        setAuthors([...authors, newAuthor]);
        setShowAddForm(false);
      }

      setFormData({});
      setError(null);
    } catch (err) {
      setError("Failed to save author");
      console.error("Error saving author:", err);
    } finally {
      setImagePreview(null);
    }
  };

  const handleEdit = async (author: Artist) => {
    setEditingAuthor(author.id);
    setFormData(author);
    const photo = authorImages[author.id];
    setImagePreview(photo || null);
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
    setImagePreview(null);
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
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Author preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/64x64.png?text=Author";
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
                  placeholder="Tell us about the author..."
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
              {authors.map((author) => (
                <tr key={author.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image
                      src={
                        authorImages[author.id] ||
                        "https://placehold.co/40x40.png?text=Author"
                      }
                      alt="Author"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/40x40.png?text=Author";
                      }}
                    />
                  </td>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 max-w-xs truncate">
                      {author.bio || "No bio available"}
                    </div>
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
