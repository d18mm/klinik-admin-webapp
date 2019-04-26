// Import the Firebase modules that you need in your app.
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
// Initalize and export Firebase.
const config = {
  apiKey: "AIzaSyBaqTY9uPk2vRHElXi7MpH5Nf-QL6ZsotM",
  authDomain: "klinik-42c04.firebaseapp.com",
  databaseURL: "https://klinik-42c04.firebaseio.com",
  projectId: "klinik-42c04",
  storageBucket: "klinik-42c04.appspot.com",
  messagingSenderId: "700916185190"
};

firebase.initializeApp(config);
firebase.firestore.FieldValue.arrayUnion({});
export const auth = firebase.auth();
export const db = firebase.firestore();
export const timestamp = firebase.firestore.Timestamp;
export const functions = firebase.functions();
export const storage = firebase.storage();
