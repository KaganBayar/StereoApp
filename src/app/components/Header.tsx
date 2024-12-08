"use client"
import Link from 'next/link';
import { FaMusic, FaSearch } from 'react-icons/fa';
import { VscArchive } from "react-icons/vsc";



const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <Link href="/" className="flex  items-center">
                <div className="bg-white rounded-full p-2">
                    <FaMusic className="text-gray-800 text-2xl" />
                </div>
            </Link>

            <div className="mx-4">
                <div className="relative w-96 ">
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

            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Login
            </button>
        </header>
    );
};

export default Header;