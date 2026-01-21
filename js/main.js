/*
Author: Sriyan Yarlagadda (neatened a bit by Ethan)
file: main.js
Purpose: properly render the  header navbar based on whether user is logged in or not
and export the function for use in other js files that also use window.onload
*/

import {getUserName, signOutUser} from './lib.js';

// Check if user is currently logged in to update HTML accordingly
// Sriyan coded this. 
function updateNavbar(){
  //get current user info
  let user = getUserName();
  
  if (user === null){
    //user is not logged in
    const navbar = document.getElementById("navbar-div");
    navbar.classList.add("navbar-expand-lg");
    navbar.classList.remove("navbar-expand-xl");

    // remove flights and booking links if they exist
    const flightsLink = document.getElementById("flightsLink");
    const bookingLink = document.getElementById("bookingLink");

    //check if elements exist before removing to prevent errors
    if (flightsLink){
      flightsLink.remove();
    }

    if (bookingLink){
      bookingLink.remove();
    }

    //Set login button to redirect to login page
    const loginButton = document.getElementById("loginButton");
    loginButton.innerHTML = "Log In"; //Change button text

    loginButton.onclick = function(){
      window.location = "login.html"; //redirect to login page when clicked
    }

  }
  
  else { //User is logged in


    //redirect to dashboard if on login or signup page
    if(window.location.href.includes('login') || window.location.href.includes('signup')){
      window.location = "dashboard.html";
    }


    const navbar = document.getElementById("navbar-div");
    
    // make sure there is only one instance of navbar expansion class
    navbar.classList.remove("navbar-expand-lg");
    navbar.classList.add("navbar-expand-xl");

    //Declare navlist to add new elements
    const navlist = document.getElementById("navlist");

    // add dashboard link
    const flights = document.createElement("li");
    flights.id = "flightsLink";
    flights.classList="nav-item";
    
    //simplified this to just use innerHTML instead of creating.
    flights.innerHTML= `
      <a href="dashboard.html" class="text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item">
        Dashboard
      </a>`;


    // insert before login button
    const buttonListElement = document.getElementById("loginButton").parentElement.parentElement
    navlist.insertBefore(flights, buttonListElement);

    // add booking link
    const booking = document.createElement("li");
    booking.id = "bookingLink";
    booking.classList = "nav-item";
    booking.innerHTML =  `
      <a href="booking.html" class="text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item">
        Booking
      </a>`;

    navlist.insertBefore(booking, buttonListElement);

    //Finally, set login button to sign out user
    const loginButton = document.getElementById("loginButton");
    loginButton.innerHTML = "Log Out";
    loginButton.onclick = function(){
      signOutUser(); //sign out user when clicked - declared in lib.js
      updateNavbar(); // update navbar after signing out
    }

  }
}

window.onload = function(){
  updateNavbar(); //call function
  // console.log("page loaded");
}

export {updateNavbar};