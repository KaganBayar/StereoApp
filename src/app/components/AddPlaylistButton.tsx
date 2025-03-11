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
import { createPlaylistAction, login } from "@/lib/actions";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export function AddPlaylistButton() {
  const user = useContext(UserContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const email = user?.user.email;

    setOpen(false);
    createPlaylistAction(email!).then((res) => {
      router.push(`/playlist/${res}`);
    });
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
