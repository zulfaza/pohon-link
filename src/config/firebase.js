import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA5RYDqE_Y9cBUgX9GIVPEMDwf5OkGkr1c",
    authDomain: "ujicobareact.firebaseapp.com",
    databaseURL: "https://ujicobareact.firebaseio.com",
    projectId: "ujicobareact",
    storageBucket: "ujicobareact.appspot.com",
    messagingSenderId: "79861944749",
    appId: "1:79861944749:web:b22d273243280382b29124",
    measurementId: "G-Q27M95JPDT"
  };
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();
export const db = firebase.firestore();
export const auth = app.auth();
export const storage = app.storage();
export default app;