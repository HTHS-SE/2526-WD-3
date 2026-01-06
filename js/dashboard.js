// ----------------- User Dashboard --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions for firebase from lib.js file

import { firebaseConfig, app, auth, db } from './lib.js';

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


// --------------------- Get reference values -----------------------------
let welcome = document.getElementById("welcome"); // Welcome header

// ------------------------ Load user's name ------------------------------
async function setWelcomeMessage(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      // Structure: accountInfo.firstName
      const firstName = data.accountInfo?.firstName;

      if (firstName) {
        welcome.textContent = `Hi, ${firstName}!`;
      } else {
        welcome.textContent = "Hi!";
      }
    } else {
      welcome.textContent = "Hi!";
    }
  } catch (err) {
    console.log("Error getting user info:", err);
    welcome.textContent = "Hi!";
  }
}

// --------------------------- Page Loading -------------------------------
window.onload = function () {
  // Wait for auth to confirm who is logged in
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // If not logged in, send to your login page
      window.location.href = "login.html";
      return;
    }

    // Logged in: load name and show greeting
    setWelcomeMessage(user);
  });
};
