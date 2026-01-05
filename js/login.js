import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

import {getDatabase, ref, set, push, update, child, get}
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js';


import {app, firebaseConfig,auth,db} from './lib.js';
    

//return instance of app's FRD

// ---------------------- Sign-In User ---------------------------------------/