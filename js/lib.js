import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

import {getDatabase} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js';


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBd7QCKQ7DH_VXSGqq8PrzseJNsG5G_LFo",
    authDomain: "twilight-airlines.firebaseapp.com",
    databaseURL: "https://twilight-airlines-default-rtdb.firebaseio.com",
    projectId: "twilight-airlines",
    storageBucket: "twilight-airlines.firebasestorage.app",
    messagingSenderId: "124519684752",
    appId: "1:124519684752:web:79bf1b4e2f5b253f689615"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db= getDatabase(app);

  
export {app, firebaseConfig,auth,db};