import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCHcaN8V16nto8KzmMeCK0jBslU9y2iHcg",
    authDomain: "cards-fa09d.firebaseapp.com",
    projectId: "cards-fa09d",
    storageBucket: "cards-fa09d.firebasestorage.app",
    messagingSenderId: "669421117319",
    appId: "1:669421117319:web:5996c89c69c54991223d22"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);