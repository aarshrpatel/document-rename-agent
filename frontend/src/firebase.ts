// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSiPnJNyOHEqPR6w1sAIwg3ibtLKcm25E",
  authDomain: "document-rename-agent.firebaseapp.com",
  projectId: "document-rename-agent",
  storageBucket: "document-rename-agent.firebasestorage.app",
  messagingSenderId: "194526501787",
  appId: "1:194526501787:web:b51fc4884b48a50e8a9f3e",
  measurementId: "G-LHKRL39VKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);