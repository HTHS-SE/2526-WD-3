import {app, firebaseConfig,auth,db,getUserName} from './lib.js';

// Add onclick property to login button
const loginButton = document.getElementById("loginButton");
loginButton.onlick = function(){
  window.location="login.html";
}

// Check if user is currently logged in to update HTML accordingly
let user = getUserName();
if (user === null){
  
}
else {
  const navbar = document.getElementById("navbar-div");
  navbar.classList.remove("navbar-expand-lg");
  navbar.classList.add("navbar-expand-xl");
  const navlist = document.getElementById("navlist");

  const flights = document.createElement("li");
  flights.classList="nav-item";
  const flightsLink = document.createElement("a");
  flightsLink.href = "flights.html";
  flightsLink.classList= "text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item";
  flightsLink.innerHTML= "My Flights";
  flights.appendChild(flightsLink);
  navlist.appendChild(flights);

}
