"use client";
import Sidebar from "../components/Sidebar";
import Box from "../components/misc/Box";
import MusicPlayer from "../components/MusicPlayer";
import ReactQueryProvider from "@/lib/client/reactQueryDevtools";
import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/server/layers/actions/authActions";
import { getAccessCookie, getRefreshCookie } from "@/lib/server/layers/actions/cookieActions";

interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  useEffect(() => {
    let ignore = false;
    const fetchRefreshAccessTokenAction = async () => {
      const accessCookie = await getAccessCookie().catch(() => null);
      const refreshCookie = await getRefreshCookie().catch(() => null);

      if (!accessCookie && refreshCookie) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Failed to refresh access token:", error);
        }
      }
    };
    if (!ignore) {
      fetchRefreshAccessTokenAction();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex">
      <ReactQueryProvider>
        <Sidebar />
        <Box className="ml-40 mt-16 p-4 w-full mr-1 rounded-md mb-20">
          {children}
        </Box>
        <MusicPlayer />
      </ReactQueryProvider>
    </div>
  );
}
