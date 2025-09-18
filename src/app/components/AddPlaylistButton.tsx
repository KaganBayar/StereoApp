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
} from "@/app/components/ui/alert-dialog";
import { createPlaylistAction } from "@/lib/server/dbActions";
import { useContext } from "react";
import UserContext, { DispatchContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export function AddPlaylistButton() {
  //[UPDATE NEEDED] You shouldnt get user with useContext userContext because if user's informations are not up to date it shouldnt throw an error.
  //[UPDATE NEEDED] i changed the logic of playlist create action. now it doesnt create the playlist with default data. it needs data parameter.
  //not use requireValidation until error handling is done
  const user = useContext(UserContext);
  //[UPDATE NEEDED] IF THERE ARE NO USER IT SHOULD ACTIVATE AUTH DIALOG
  console.log("add playlist button rendered");
  const dispatch = useContext(DispatchContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSubmit = () => {
    setOpen(false);
    if (!user) {
      console.error("User is not available");
      return;
    } else {
      createPlaylistAction(user.email).then(async (res) => {
        dispatch!({
          type: "ADDPLAYLIST",
          payload: [...user.playlists],
        });
        router.push(`/playlist/${res}`); //router cause bug about playlists
        console.log("Playlist created successfully");
      });
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
