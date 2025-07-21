"use client";
import { useState } from "react";
import { User } from "@/lib/types";
import { useContext } from "react";
import { findAllUsers } from "@/lib/dbActions";
const UserAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  async function setAllUsers() {
    setUsers(await findAllUsers());
  }
  setAllUsers();

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditForm(user);
  };

  return (
    <div>
      <div className="pt-6 p-4 text-neutral-200 text-xl">Users</div>
      <div>{}</div>
    </div>
  );
};

export default UserAdmin;
