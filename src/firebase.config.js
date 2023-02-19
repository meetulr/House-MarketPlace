// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCc7w1IpxjVx9AiRY-clWaA9FEG6hXEN0Y",
    authDomain: "house-marketplace-app-5f32b.firebaseapp.com",
    projectId: "house-marketplace-app-5f32b",
    storageBucket: "house-marketplace-app-5f32b.appspot.com",
    messagingSenderId: "203011275942",
    appId: "1:203011275942:web:a89bec28795313a5100867"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();