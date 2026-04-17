import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos la base de datos

const firebaseConfig = {
  apiKey: "AIzaSyBQjpjYhfnxvdY8dUowb2IAikRqyz02Qpk",
  authDomain: "torneo-de-mancos.firebaseapp.com",
  projectId: "torneo-de-mancos",
  storageBucket: "torneo-de-mancos.firebasestorage.app",
  messagingSenderId: "910795039316",
  appId: "1:910795039316:web:444ef504629e5ccc1183c1",
  measurementId: "G-N0LYQSBRXG"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
// Exportamos "db" para poder usar la base de datos en toda la aplicación
export const db = getFirestore(app);