"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { login, register } from "@/lib/server/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useContext } from "react";
import { DispatchContext } from "@/contexts/UserContext";
import { findUserByEmail, findUserPlaylists } from "@/lib/server/dbActions";
import { auth } from "@/../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export const AuthDialog = () => {
  const emptyFormData = new FormData();
  const [loginState, loginAction, loginPending] = useActionState(
    handleLogin,
    undefined
  );
  const [registerState, registerAction, registerPending] = useActionState(
    handleRegister,
    undefined
  );
  const dispatch = useContext(DispatchContext);
  const [open, setOpen] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState("login");

  async function handleLogin(previousState: void, formData: FormData) {
    try {
      console.log("logining");
      //[UPDATE NEEDED] Deal with these in implementing auth actions phase
      await login(formData); //in new auth action it should return user payload directly

      const email = formData.get("email") as string;
      if (!email) {
        throw new Error("Email not provided");
      }
      const user = await findUserByEmail(email); //this shouldnt be here in new auth action
      if (!user) {
        throw new Error("User not found");
      }
      const playlist = await findUserPlaylists(user.id); //user data should include playlists in new auth action
      console.log("USER", user);
      if (dispatch) {
        dispatch({
          type: "LOGIN",
          payload: {
            id: user.id,
            photo_url: user.photo_url,
            name: user.name,
            email: email,
            playlists: playlist,
            roles: user.roles,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        });
      }
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async function handleRegister(prevState: void, formData: FormData) {
    try {
      console.log("registering");

      await register(formData); //server action
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formData.get("name") as string,
          });
        })
        .catch((error) => {
          const errorMessage = error.message;
          throw new Error(errorMessage);
          // ..
        });

      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          {loginOrRegister === "login" ? "Login" : "Register"}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">
            {loginOrRegister === "login" ? "Login" : "Register"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Enter your credentials to{" "}
            {loginOrRegister === "login" ? "login" : "register"}
          </DialogDescription>
        </DialogHeader>
        {loginOrRegister === "login" && (
          <form action={loginAction} id="login">
            <div>
              <div>
                <label htmlFor="email" className="block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full py-2 px-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full py-2 px-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p
                onClick={() => {
                  setLoginOrRegister("register");
                }}
              >
                register
              </p>
            </div>
          </form>
        )}
        {loginOrRegister === "register" && (
          <form action={registerAction} id="register">
            <div>
              <div>
                <label htmlFor="name" className="block">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full py-2 px-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full py-2 px-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full py-2 px-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p
                onClick={() => {
                  setLoginOrRegister("login");
                }}
              >
                Login
              </p>
            </div>
          </form>
        )}

        <div className="flex justify-end space-x-4">
          <button
            form={loginOrRegister === "login" ? "login" : "register"}
            type="submit"
            disabled={
              loginOrRegister === "login" ? loginPending : registerPending
            } // Disable button when loading
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            {loginPending || registerPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loginOrRegister === "login"
                  ? "Logging in..."
                  : "Signing up..."}
              </>
            ) : loginOrRegister === "login" ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
          <DialogClose asChild>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
