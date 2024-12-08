"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { login, register } from "@/lib/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useContext } from "react";
import { DispatchContext } from "@/contexts/UserContext";
import UserContext from "@/contexts/UserContext";
import { findUserByEmail } from "@/lib/actions";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const AuthDialog = () => {
  const dispatch = useContext(DispatchContext);
  const user = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState("login");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    setOpen(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
      return;
    }
    const name = user?.name;
    if (dispatch) {
      dispatch({
        type: "LOGIN",
        payload: {
          name: name,
          email: email,
        },
      });
    }
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    setOpen(false);
    const formData = new FormData(e.currentTarget);
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
          <form action={login} onSubmit={handleLogin} id="login">
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
          <form action={register} onSubmit={handleRegister} id="register">
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loginOrRegister === "login" ? "Login" : "Register"}
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
