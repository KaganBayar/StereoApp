"use client";
import Sidebar from "../components/Sidebar";
import Box from "../components/Box";
import { DispatchContext } from "@/contexts/UserContext";
import { useContext } from "react";
import { findUserByEmail } from "@/lib/actions";

interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex">
      <Sidebar />
      <Box className="ml-40 mt-16 p-4 w-full mr-2 rounded-md">{children}</Box>
    </div>
  );
}
