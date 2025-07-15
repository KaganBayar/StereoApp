"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createPlaylistAction } from "@/lib/actions";
import { useContext } from "react";
import UserContext, { DispatchContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { usePlaylistRefresh } from "@/contexts/playlistRefreshed";
import { ref } from "firebase/storage";

export function AddPlaylistButton() {
  const user = useContext(UserContext);
  const dispatch = useContext(DispatchContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const refreshContext = usePlaylistRefresh();
  const handleSubmit = async () => {
    const email = user?.user.email;
    setOpen(false);
    if (!email) {
      console.error("User email is not available");
      return;
    } else {
      await createPlaylistAction(email!).then(async (res) => {
        await refreshContext?.refreshPlaylists();
        dispatch!({
          type: "ADDPLAYLIST",
          payload: [...user!.user.playlists],
        });
        router.push(`/playlist/${res.id}`);
      });

      console.log("Playlist created successfully");
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <FaPlus className=" relative text-gray-400 hover:text-white cursor-pointer translate translate-y-1/4" />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className=" text-gray-white">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-gray-100">
              This action will create a new playlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSubmit()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
