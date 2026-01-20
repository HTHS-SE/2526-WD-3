import {getUserName, signOutUser} from './lib.js';
// Add onclick property to login button

// Check if user is currently logged in to update HTML accordingly
// Sriyan coded this. 
function updateNavbar(){
  let user = getUserName();
  
  if (user === null){
    const navbar = document.getElementById("navbar-div");
    navbar.classList.add("navbar-expand-lg");
    navbar.classList.remove("navbar-expand-xl");
    const flightsLink = document.getElementById("flightsLink")
    const bookingLink = document.getElementById("bookingLink")
    if (flightsLink){
      flightsLink.remove()
    }
    if (bookingLink){
      bookingLink.remove()
    }
    const loginButton = document.getElementById("loginButton");
    loginButton.innerHTML = "Log In";
    loginButton.onclick = function(){
      window.location= "login.html";
    }
  }
  else {
    if(window.location.href.includes('login') || window.location.href.includes('signup')){
      window.location = "dashboard.html";
    }
    const navbar = document.getElementById("navbar-div");
    navbar.classList.remove("navbar-expand-lg");
    navbar.classList.add("navbar-expand-xl");
    const navlist = document.getElementById("navlist");

    const flights = document.createElement("li");
    flights.id = "flightsLink";
    flights.classList="nav-item";
    const flightsLink = document.createElement("a");
    flightsLink.href = "dashboard.html";
    flightsLink.classList= "text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item";
    flightsLink.innerHTML= "Dashboard";
    flights.appendChild(flightsLink);

    const buttonListElement = document.getElementById("loginButton").parentElement.parentElement
    navlist.insertBefore(flights, buttonListElement);

    const booking = document.createElement("li");
    booking.id = "bookingLink";
    booking.classList="nav-item";
    const bookingLink = document.createElement("a");
    bookingLink.href = "booking.html";
    bookingLink.classList= "text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item";
    bookingLink.innerHTML= "Booking";
    booking.appendChild(bookingLink);

    navlist.insertBefore(booking, buttonListElement);


    const loginButton = document.getElementById("loginButton");
    loginButton.innerHTML = "Log Out";
    loginButton.onclick = function(){
      signOutUser();
      updateNavbar();
    }
  }
}

window.onload = function(){
  updateNavbar();
  console.log("page loaded");
}

export {updateNavbar};