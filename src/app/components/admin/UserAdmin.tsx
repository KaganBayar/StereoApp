"use client";
import { useState, useEffect } from "react";
import { User, UserAdminEditForm } from "@/lib/Types/userTypes";
import { findAllUsers } from "@/lib/server/dbActions";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { updateUser } from "@/lib/server/dbActions";
import { deleteUser } from "@/lib/server/dbActions";
import { logout, systemLogout } from "@/lib/server/actions";
import { Loader } from "@/lib/client/firebaseActions";
const UserAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserAdminEditForm>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // not yet implemented
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // [NEED UPDATE] dont useEffect for fetching
  useEffect(() => {
    let ignore = false;
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await findAllUsers();
        if (ignore) return;
        setUsers(fetchedUsers);
        setError(null);
        //[NEED UPDATE] error handlings havent properly implemented
      } catch (err: any) {
        if (
          err.message?.includes("UNAUTHORIZED") ||
          err.message?.includes("FORBIDDEN")
        ) {
          setError(
            "Session expired or insufficient permissions. Please log in again."
          );
        } else {
          setError("Failed to load users");
        }
        console.error("Error loading users:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    const editForm: UserAdminEditForm = {
      name: user.name,
      email: user.email,
      roles: user.roles,
      photo_url: user.photo_url,
    };
    setEditForm(editForm);
    setImagePreview(user.photo_url || null);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!editingUser || !editForm.name || !editForm.email) return;

    if (editForm.photo_url && typeof editForm.photo_url !== "string") {
      setError("Invalid photo URL format");
      return;
    }

    try {
      const updatedUser: User = await updateUser(editingUser, editForm);
      await systemLogout(editingUser);
      setUsers(
        users.map((user) =>
          user.id === editingUser ? { ...user, ...editForm } : user
        )
      );
      setEditingUser(null);
      setEditForm({});
    } catch (err: any) {
      if (
        err.message?.includes("UNAUTHORIZED") ||
        err.message?.includes("FORBIDDEN")
      ) {
        setError(
          "Session expired or insufficient permissions. Please log in again."
        );
      } else {
        setError("Failed to update user");
      }
      console.error("Error updating user:", err);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      await systemLogout(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err: any) {
      if (
        err.message?.includes("UNAUTHORIZED") ||
        err.message?.includes("FORBIDDEN")
      ) {
        setError(
          "Session expired or insufficient permissions. Please log in again."
        );
      } else {
        setError("Failed to delete user");
      }
      console.error("Error deleting user:", err);
    }
  };

  const handleInputChange = (field: keyof User, value: string | string[]) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEditForm({ ...editForm, photo_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Users</div>
        <div className="text-neutral-400">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6 p-4">
        <div className="text-neutral-200 text-xl mb-4">Users</div>
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-7 p-4 w-full">
      <div className="text-neutral-200 text-xl mb-6">
        Users ({users.length})
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Playlists
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {users.map((user) => (
                <tr key={user.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <div className="flex flex-col space-y-2">
                        <Image
                          src={
                            //[NEED UPDATE]src shouldnt be photo_url but backend havent implemented
                            imagePreview ||
                            editForm.photo_url ||
                            "https://placehold.co/40x40.png?text=User"
                          }
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://placehold.co/40x40.png?text=User";
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="bg-gray-700 text-white px-1 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-xs w-32 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white file:rounded file:cursor-pointer hover:file:bg-blue-700"
                        />
                      </div>
                    ) : (
                      //[NEED UPDATE]src shouldnt be photo_url but backend havent implemented
                      <Image
                        src={
                          user.photo_url ||
                          "https://placehold.co/40x40.png?text=User"
                        }
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://placehold.co/40x40.png?text=User";
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-sm text-gray-300">{user.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={
                          Array.isArray(editForm.roles)
                            ? editForm.roles.join(", ")
                            : ""
                        }
                        onChange={
                          (e) =>
                            handleInputChange(
                              "roles",
                              e.target.value.split(", ").filter((r) => r.trim())
                            )
                          //[UPDATE NEEDED] INPUTING ROLES ARE BUGGY
                        }
                        placeholder="admin, user"
                        className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {user.playlists?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser === user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="text-green-400 hover:text-green-300"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No users found</div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
