import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLRtmDo78Dbohu9NRD-lbAmUO-Htqre4I",
  authDomain: "assistant-71122.firebaseapp.com",
  databaseURL: "https://assistant-71122-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "assistant-71122",
  storageBucket: "assistant-71122.firebasestorage.app",
  messagingSenderId: "123623966806",
  appId: "1:123623966806:web:4a53e74c6c2e44d8ac53f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
