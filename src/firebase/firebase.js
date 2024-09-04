import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyDaPLIn-3x7SqD0HrlOvAGPr-7yXhVZN4Y",
    authDomain: "mentoring-49db8.firebaseapp.com",
    projectId: "mentoring-49db8",
    storageBucket: "mentoring-49db8.appspot.com",
    messagingSenderId: "369478412455",
    appId: "1:369478412455:web:9edf4b64bd34a8ddab9382"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider()






// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDaPLIn-3x7SqD0HrlOvAGPr-7yXhVZN4Y",
//   authDomain: "mentoring-49db8.firebaseapp.com",
//   projectId: "mentoring-49db8",
//   storageBucket: "mentoring-49db8.appspot.com",
//   messagingSenderId: "369478412455",
//   appId: "1:369478412455:web:9edf4b64bd34a8ddab9382"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export {app, auth};