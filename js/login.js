import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js';

import {getDatabase, ref, set, push, update, child, get}
  from 'https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js';


import {app, firebaseConfig,auth,db} from './lib.js';
    

//return instance of app's FRD

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById("signIn").onclick  = function signInUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;


    //attempt to sign-in user with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            //update log in date in the db
            //update will only overwrite the fields specified and won't delete other data
            update(ref(db, 'users/' + user.uid + '/accountInfo'), {
                lastLogin: new Date()
            })
                .then(() => {
                    alert("Sign-in successful!");
                    // get snapshot of all user information that will be passed
                    // to login() function and stored in either session or local storage
                    get(
                        ref(db, 'users/' + user.uid + '/accountInfo'))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(snapshot.val());
                                logIn(snapshot.val()); //TODO: Define
                            } else {
                                console.log("User does not exist in database.");
                            }
                        }).catch((error) => {
                            alert('Error getting user data');
                            console.error("Error getting user data: ", error);
                        })
                })
                .catch((error) => {
                    console.error("Error updating last login: ", error);
                    alert("Sign-in successful, but failed to update last login time.");
                });
        })
        .catch((error) => {
            const {code , message} = error;
            alert("Sign-in failed: " + message,code);
        });
}

// ---------------- Keep User Logged In ----------------------------------//

function logIn(user){
    //store user info in session storage
    let keeploggedIn = document.getElementById("keepLoggedInSwitch").ariaChecked;
    if (!keeploggedIn){
        sessionStorage.setItem("user", JSON.stringify(user));
        window.location = "home.html"; 
    }
    else{
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("keepLoggedIn", "Yes");
        window.location = "home.html";
    }
}