import {app, firebaseConfig,auth,db,getUserName,signOutUser,setData,updateData,getData} from './lib.js';
import {updateNavbar} from './main.js';

//defining airports
let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];


// Populate the airport options in a select dropdown within an element string which passed in as the param
async function populateAirportOptions(selectObjectId){
    const selectObject = document.getElementById(selectObjectId);
    for (let i = 0; i < haunted_airport_names.length; i++){
        selectObject.innerHTML +=`<option value="${haunted_airport_names[i]}">${haunted_airport_names[i]}</option>`;
    }
}

let date = new Date();

function dateObjToString(dateobj){ 
    return dateobj.toISOString().split('T')[0];
}

// This function creates the html for a card of flight data
function generateFlightCard(flightData,date,baseId){    
    return `
    <div class="p-3 mb-1 bg-white rounded d-md-flex justify-content-md-center" style="width:95vw;margin:1.5rem">
            
            <div class="col-md-4 p-4">
                <h4 role="button" class="card-title fw-bold text-primary mb-3" id="flight-destination-${baseId}">
                    <i class="bi bi-airplane-fill me-2"></i>
                    Flight to ${flightData['flight-to']} 
                </h4>
                <div class="small text-muted">
                    <p class="mb-2">
                        <i class="bi bi-alarm-fill m-2"></i><strong>Dep Time:</strong> ${flightData['departure']}:00
                    </p>
                    <p class="mb-2">
                        <i class="bi bi-calendar-fill m-2"></i><strong>Date:</strong> ${dateObjToString(date)}
                    </p>
                    <p class="mb-0">
                        <i class="bi bi-person-badge m-2"></i><strong>Pilot:</strong> ${flightData['pilot']}
                    </p>

                </div>
            </div>

            <img src="./img/${flightData['landing_at']}.jpg" alt="Arrival Airport" class="ms-auto" style="max-height:20vh">
            <div class="vr"></div>
            <div class="m-3 p-2">
                <h3><b>$${Math.round(parseInt(flightData['price'],10)/100,3)*100}</b></h3> 
                <p>Luxury Guaranteed!</p>
                <br> 
                <button type="button" id="book-now-button-${baseId}" class="animated-button">Book Now</button>
            </div>
        </div>
    `;
}

//pasted in from main.js so as to ensure window.onload works correctly
function updateNavbar(){
  let user = getUserName();
  console.log(user);
  
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
    flightsLink.href = "flights.html";
    flightsLink.classList= "text-site-theme nav-underline nav-link hover-underline-animation nbMenuItem navbar-item";
    flightsLink.innerHTML= "My Flights";
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

function returnflightpath(airportCode,date){
   return `flights/${airportCode}/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate()}`
}

//returns a function that opens popup booking a flight with the given details
function returnbookingfunction(deets,path){
    return function openPopup(){
        document.getElementById('booking-popup').style.display='block';
        document.getElementById('popup-departure-airport').innerHTML=document.getElementById('start-date').value;
        document.getElementById('popup-arrival-airport').innerHTML=deets['flight-to'];
        document.getElementById('popup-departure-time').innerHTML=String(deets['departure']) + ':00';
        document.getElementById('popup-pilot-name').innerHTML=deets['pilot'];
        document.getElementById('popup-avalable-space').innerHTML=deets['avalable_space'];
        document.getElementById('popup-flight-price').innerHTML=deets['price'];

        document.getElementById('confirm-booking-button').addEventListener('click', function(){
            updateData(db, path, 'avalable_space', parseInt(deets['avalable_space'],10)-1);
            updateData(db, 'users/'+getUserName().uid+'/bookings', encodeURIComponent(path),new Date().toISOString());
            alert('Booking Confirmed! Thank you for choosing Twilight Airlines!');
            document.getElementById('booking-popup').style.display='none';
        },{ once: true });
    }
}

window.onload = function(){
    updateNavbar();
    document.getElementById('close-popup-button').onclick=function(){
        document.getElementById('booking-popup').style.display='none';
    };

    populateAirportOptions('departure-airport-select');
    document.getElementById('start-date').min=dateObjToString(date); //sets the minimum start date to the current date

    this.document.getElementById('get-flights-btn').onclick = async function getflights(){
        let startdate = new Date(document.getElementById('start-date').value);
        let finishdate = new Date(document.getElementById('end-date').value);
        let airportDocument = document.getElementById('departure-airport-select').value;
        let airportCode = haunted_airport_codes[haunted_airport_names.indexOf(airportDocument)];
        document.getElementById('flight-results').innerHTML="";

        for (let d = startdate; d <= finishdate; d.setDate(d.getDate() + 1)) {
            let flightsoftheday = await getData(db, returnflightpath(airportCode,d));
            console.log(flightsoftheday);
            for (let flight in flightsoftheday){
                console.log(flight);
                let newResultElement = document.createElement('div');
                
                let resultId = dateObjToString(d) + '-' + flight;
                newResultElement.innerHTML = generateFlightCard(flightsoftheday[flight],d,resultId);
                newResultElement.id= resultId; //the id of the result element
                document.getElementById('flight-results').appendChild(newResultElement);

                document.getElementById('book-now-button-'+resultId).addEventListener('click', returnbookingfunction(flightsoftheday[flight],returnflightpath(airportCode,d)+'/'+flight));
                document.getElementById('flight-destination-'+resultId).onclick = returnbookingfunction(flightsoftheday[flight],returnflightpath(airportCode,d)+'/'+flight);
                
            }
        }

    }
}

