// Import the Firebase functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsHTSZTN1LUsnHtQehQEZBZTuPZllg4aA",
  authDomain: "netralink-cbfee.firebaseapp.com",
  projectId: "netralink-cbfee",
  storageBucket: "netralink-cbfee.appspot.com",
  messagingSenderId: "419454724320",
  appId: "1:419454724320:web:bd868fbcb3b3ebb9f2c885"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized services
export { auth, db, storage };