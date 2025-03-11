import {
  applicationDefault,
  initializeApp as initiliazeAdminApp,
} from "firebase-admin/app";

import { initializeApp } from "firebase/app";



export const adminApp = initiliazeAdminApp({
  credential: applicationDefault(),
});




