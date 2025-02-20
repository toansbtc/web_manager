import { getApp, getApps, initializeApp } from "firebase/app";
import { FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getDatabase } from "firebase/database"; // For Realtime Database
import { getStorage } from "firebase/storage";
import { UserCredential } from "firebase/auth"
import data_return from "../../views/decladeInterface/authenInterface";
import { useRouter } from "next/router";

const fireBase_config = {
    apiKey: "AIzaSyBHDv5qk7zavVDCbV4RFgVIPalu1UUaf6I",

    authDomain: "appmusic-68bd2.firebaseapp.com",

    projectId: "appmusic-68bd2",

    storageBucket: "appmusic-68bd2.appspot.com",

    messagingSenderId: "556001132310",

    appId: "1:556001132310:web:2e2dc594978f5d37b29a37",
}

let app = getApps().length ? getApp() : initializeApp(fireBase_config);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider();
export const faceBookProvider = new FacebookAuthProvider();
export const user: string = 'user';

export function get_error_code(errorCode: String): String {
    console.log("firebase error code: ", errorCode)
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return ("This email is already in use.");
        case 'auth/invalid-email':
            return ("The email address is not valid.");
        case 'auth/operation-not-allowed':
            return ("Email/Password accounts are not enabled.");
        case 'auth/weak-password':
            return ("The password is too weak.");
        case 'auth/invalid-credential':
            return ("User or password incorect.");
        default:
            return ("An unknown error occurred.");
    }
}

// export function set_user(user: string) {
//     localStorage.setItem('userName', user);
// }

// export function get_user(): string {
//     return localStorage.getItem('userName');
// }

// export function log_out() {
//     localStorage.removeItem('userName');

// }
