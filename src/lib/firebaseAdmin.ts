import {
  applicationDefault,
  initializeApp as initiliazeAdminApp,
} from "firebase-admin/app";

//music-kendim.appspot.com

export const adminApp = initiliazeAdminApp({
  credential: applicationDefault(),
});
