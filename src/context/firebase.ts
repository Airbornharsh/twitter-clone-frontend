import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW8dOe99N3mWsqU1tRYg8D3YBnH2rd_NM",
  authDomain: "internship-task-twitter.firebaseapp.com",
  projectId: "internship-task-twitter",
  storageBucket: "internship-task-twitter.appspot.com",
  messagingSenderId: "519583087038",
  appId: "1:519583087038:web:7fd727c7a3f4192ad9e1ef",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export default auth;
