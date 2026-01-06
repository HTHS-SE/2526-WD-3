import { getAuth, createUserWithEmailAndPassword } 
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

import {ref, set}
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js';


import {app, firebaseConfig,auth,db} from './lib.js';

// ---------------- Register New User --------------------------------//
document.getElementById("submitData").onclick  = function registerUser(){
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPass").value;

  let validationMessage = validation(firstName, lastName, email, password);
  //Validate user inputs
  if (validationMessage != null){
    alert(validationMessage);
    return; //exit function if validation fails
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User account created and signed in successfully
      const user = userCredential.user;

      // ... Add user account info to realtime db
      //set will create the data at the path specified, overwriting any existing data
      ///each user will be placed in the users node, under their unique uid
      set(ref(db, 'users/' + user.uid+'/accountInfo'), {
        uid: user.uid, //save the userID for home.js reference
        firstName: firstName,
        lastName: lastName,
        email: email
      })
      .then(() => {
        // Data saved successfully!
        alert("Registration Successful! You may now sign in.");
      })
      .catch((error) => {
        // The write failed...
        alert("Registration failed: " + error.message);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//



function validation(firstName, lastName, email, password){
  let fnameRegex = /^[a-zA-Z]+$/;
  let lnameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;
  if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) ||
      isEmptyorSpaces(email) || isEmptyorSpaces(password)){
        return "Please complete all fields correctly.";
  }
  if (!fnameRegex.test(firstName)){
    return "Please enter a valid first name.";
  }
  if (!lnameRegex.test(lastName)){
    return "Please enter a valid last name.";
  }
  if (!emailRegex.test(email)){
    return "Please enter a valid email address.";
  }
  if (password.length < 6){
    return "Password must be at least 6 characters long.";
  }
  return null
}
