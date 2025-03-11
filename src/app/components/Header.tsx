"use client";
import Link from "next/link";
import { BiHome } from "react-icons/bi";
import { FaMusic, FaSearch } from "react-icons/fa";
import { VscArchive } from "react-icons/vsc";

import { AuthDialog } from "./AuthDialog";
import UserContext from "@/contexts/UserContext";
import { useContext } from "react";

const Header: React.FC = () => {
  const user = useContext(UserContext);
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="flex  items-center">
        <div className="bg-white rounded-full p-2">
          <FaMusic className="text-gray-800 text-2xl" />
        </div>
      </Link>

      <div className="mx-4 flex items-center">
        <Link href="/">
          <div className="rounded-full bg-slate-900 p-3 mr-4">
            <BiHome className="text-2xl text-gray-500" />
          </div>
        </Link>
        <div className="relative w-96">
          <Link href="/search">
            <VscArchive className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white scale-150" />
          </Link>
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 pl-11 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center">
        {user?.user.email ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold border-2 border-blue-900">
              {user?.user.name ? user.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <p className="mr-2">{user?.user.name}</p>
            <button
              /* onClick={() => ()} */ /* düzelt */
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <AuthDialog />
        )}
      </div>
    </header>
  );
};

export default Header;
