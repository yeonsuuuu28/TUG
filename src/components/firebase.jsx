import firebase from 'firebase/compat/app'
import 'firebase/auth';        // for authentication
import 'firebase/database';    // for realtime database
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onDisconnect } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDiMYGX7mptEDkQQypbuaMY1ppvtdpqye4",
    authDomain: "cs473---tug.firebaseapp.com",
    projectId: "cs473---tug",
    storageBucket: "cs473---tug.appspot.com",
    messagingSenderId: "809673109050",
    appId: "1:809673109050:web:7193f606b8636b0a250f03",
    measurementId: "G-86C9LRWP15",
    databaseURL: "https://cs473---tug-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app);
export const presenceRef = ref(db, "disconnectmessage");
onDisconnect(presenceRef).set("I disconnected!");


const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => signInWithRedirect(auth, provider);
export const signOutWithGoogle = () => signOut(auth);

export default firebase;