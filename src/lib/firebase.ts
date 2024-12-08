import { initializeApp } from "firebase/app";
import { initializeApp as initiliazeAdminApp } from "firebase-admin/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "../../config/firebase";

export const app = initializeApp(firebaseConfig);

export const adminApp = initiliazeAdminApp();
export const auth = getAuth(app);
