//bunu lütfen değiştir buranın githuba eklenmesi gerek

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBairh35Q-HZDE_gfOZluWGosEWUsOZkYs",
  authDomain: "music-kendim.firebaseapp.com",
  projectId: "music-kendim",
  storageBucket: "music-kendim.appspot.com",
  messagingSenderId: "786955672996",
  appId: "1:786955672996:web:f54fe42b35c71fed2bf531",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const storageRef = ref(storage);
const profileImagesRef = ref(storageRef, "images/profile_pictures");
const musicImagesRef = ref(storageRef, "images/songs");
const artistImagesRef = ref(storageRef, "images/artists");
const albumImagesRef = ref(storageRef, "images/albums");
const songsRef = ref(storageRef, "songs");
export default app;
export {
  auth,
  storage,
  storageRef,
  profileImagesRef,
  musicImagesRef,
  artistImagesRef,
  albumImagesRef,
  songsRef,
};
