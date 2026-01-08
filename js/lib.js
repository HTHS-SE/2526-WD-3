import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  
import { getAuth,signOut } from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

import {getDatabase, ref, set, push, update, child, get, remove} from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js';


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

function getUserName(){
  //Grab value for the 'keep logged in' switch
  const keepLoggedIn = localStorage.getItem("keepLoggedIn");

  //grab user info
  let currentUser = null;
  if (keepLoggedIn === "Yes"){
    currentUser = JSON.parse(localStorage.getItem("user"));
  }
  else{
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }
  return currentUser;
}

function signOutUser(){
  //Remove user info from local/session storage
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  localStorage.removeItem("keepLoggedIn");

  signOut(auth)
  .then((auth)=>{
    alert("Sign-out successful!");
    window.location = "signIn.html"; //redirect to sign-in page
  })
  .catch((error)=>{
    alert("Error signing out: " + error.message);
  });
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(db, path,datapoint_name,data){
  //must use brackets around variable name to use it as a key
  set(ref(db, path), {
    [datapoint_name]: data
  }).then(() => {
    //alert("Data set successful!");
    })
  .catch((error) => {
    //alert("Data set failed: " + error.message);
  });
}
// -------------------------Update data in database --------------------------
async function updateData(db, path,datapoint_name,data){
  update(ref(db, path), {
    [datapoint_name]: data
  })
  .then(() => {
    //alert("Data set successful!");
    })
  .catch((error) => {
    //alert("Data set failed: " + error.message);
  });
}

// ----------------------Get a datum from FRD (single data point)---------------

function getData(db,path){
  //I updated this function to use what was on the docs as my version wasn't working
  // https://firebase.google.com/docs/database/web/read-and-write?hl=en&authuser=0#web section "Read data once with an observer"
  let dbRef = ref(db);
  get(child(dbRef, path)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
    return null;
  });

}

export {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData};