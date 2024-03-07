// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMB6mFhXSrXpfUVp7M0ICg4Bw2bwXZb4w",
  authDomain: "sc2006-app.firebaseapp.com",
  projectId: "sc2006-app",
  storageBucket: "sc2006-app.appspot.com",
  messagingSenderId: "790034011628",
  appId: "1:790034011628:web:0d43a77ee97cc3a6cf5cc9",
  measurementId: "G-ELYTDVGG5Q",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
