import { firestore, auth, initializeApp } from "firebase";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBvpahDhPFcn5bX9DDbHXO92co3-AdthDA",
  authDomain: "hola-amigos-inventory.firebaseapp.com",
  databaseURL: "https://hola-amigos-inventory-default-rtdb.firebaseio.com",
  projectId: "hola-amigos-inventory",
  storageBucket: "hola-amigos-inventory.appspot.com",
  messagingSenderId: "630101242064",
  appId: "1:630101242064:web:96625fc88b810edceb6ed5"

};
initializeApp(firebaseConfig);

export default firestore();

export const Auth = auth;


