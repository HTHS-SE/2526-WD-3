/*
Author: Ethan Wellner
File: booking.js
Description: This file contains the code to handle flight booking functionality.

It allows users to search for available flights based on the date and the airport they are departing from.
It also dynamically generates flight cards for each available flight and provides a booking popup for users to confirm their bookings.
Finally, there is a function that generates a function to handle the the booking process for when the user decides to actually dare a flight.
*/

import {db,getUserName,updateData,getData} from './lib.js';
import {updateNavbar} from './main.js';

//defining airports that u CAN attempt to book flights to/from. For legal reasons, we cannot call these destinations.
let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];

//block var for the date
let date = new Date();


// Populate the airport options in a select dropdown within an element string which passed in as the param
async function populateAirportOptions(selectObjectId){
    const selectObject = document.getElementById(selectObjectId);
    for (let i = 0; i < haunted_airport_names.length; i++){
        selectObject.innerHTML +=`<option value="${haunted_airport_names[i]}">${haunted_airport_names[i]}</option>`;
    }
}

// I've been doing this too much so i made a function for it
function dateObjToString(dateobj){ 
    return dateobj.toISOString().split('T')[0];
}

// This function creates the html for a card of flight data. Basically.
function generateFlightCard(flightData,date,baseId){    
    return `
    <div class="p-3 mb-1 bg-white rounded d-md-flex justify-content-md-center text-center text-md-start" style="width:95vw;margin:1.5rem">
            
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

            <img src="./img/${flightData['landing_at']}.jpg" alt="Arrival Airport" class="ms-md-auto d-none d-md-block me-3" style="max-height:20vh">
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

// returns the path to the flights for a given airport code and date. I've been doing the same thing too many times so I made it a function.
function returnflightpath(airportCode,date){
   return `flights/${airportCode}/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate()}`
}

//returns a function that opens popup booking a flight with the given details, as I add an event listener to a the button and the text, so I need to return a function rather than execute it directly.
function returnbookingfunction(deets,path){
    return function openPopup(){
        //Don't mind the messy code. It's inspired by our planes after doing any one of the things that are described on the terms and services.
        document.getElementById('booking-popup').style.display='block'; // show the popup.
        document.getElementById('popup-departure-airport').innerHTML=document.getElementById('start-date').value; //departure date is same as selected date
        document.getElementById('popup-arrival-airport').innerHTML=deets['flight-to']; 
        document.getElementById('popup-departure-time').innerHTML= String(deets['departure']) + ':00';
        document.getElementById('popup-pilot-name').innerHTML=deets['pilot'];
        document.getElementById('popup-avalable-space').innerHTML=deets['avalable_space'];
        document.getElementById('popup-flight-price').innerHTML=deets['price'];
        
        // set up event listener for confirm booking button
        if (deets['avalable_space']>0){
            document.getElementById('confirm-booking-button').addEventListener('click', function(){
                updateData(db, path, 'avalable_space', parseInt(deets['avalable_space'],10)-1);
                updateData(db, 'users/'+getUserName().uid+'/bookings', encodeURIComponent(path),new Date().toISOString());
                updateData(db, 'users/'+getUserName().uid+'/accountInfo', 'active-loyalty-member',true);
                alert('Booking Confirmed! Thank you for choosing Twilight Airlines!');
                document.getElementById('booking-popup').style.display='none';
            },{ once: true });
        }
        // if no available space, disable the button and change text
        else{
            const confirmButton = document.getElementById('confirm-booking-button');
            confirmButton.disabled = true;
            confirmButton.innerHTML = "No Seats Available. Lucky You!";
        }
    }
}

window.onload = function(){
    updateNavbar(); // thanks for switching this to an import Sriyan :)

    document.getElementById('close-popup-button').onclick=function(){
        document.getElementById('booking-popup').style.display='none'; //turn off the booking popup by default. Should prob just be hardcoded into html but who cares lol.
    };

    populateAirportOptions('departure-airport-select'); //populate airport options dropdown
    document.getElementById('start-date').min=dateObjToString(date); //sets the minimum start date to the current date

    //Sooooooooooo like this isn't complicated at all but whatever I'll comment it out for u ur welcome :|
    this.document.getElementById('get-flights-btn').onclick = async function getflights(){

        let startdate = new Date(document.getElementById('start-date').value);
        let finishdate = new Date(document.getElementById('end-date').value);
        let airportDocument = document.getElementById('departure-airport-select').value;
        let airportCode = haunted_airport_codes[haunted_airport_names.indexOf(airportDocument)];

        //reset the flight results div
        document.getElementById('flight-results').innerHTML="";

        // so we're gonna loop through each date from start to finish and then loop for each of the flights for those dates and create cards for them.
        for (let d = startdate; d <= finishdate; d.setDate(d.getDate() + 1)) {
            let flightsoftheday = await getData(db, returnflightpath(airportCode,d));
            //console.log(flightsoftheday);
            for (let flight in flightsoftheday){
                //console.log(flight);
                let newResultElement = document.createElement('div');
                
                let resultId = dateObjToString(d) + '-' + flight;
                newResultElement.innerHTML = generateFlightCard(flightsoftheday[flight],d,resultId); //create an element for the flight card
                newResultElement.id= resultId; //the id of the result element
                document.getElementById('flight-results').appendChild(newResultElement); //add the element to the flight results div

                // add event listeners to the book now button and the flight "destination" text
                document.getElementById('book-now-button-'+resultId).addEventListener('click', returnbookingfunction(flightsoftheday[flight],returnflightpath(airportCode,d)+'/'+flight));
                document.getElementById('flight-destination-'+resultId).onclick = returnbookingfunction(flightsoftheday[flight],returnflightpath(airportCode,d)+'/'+flight);
                
            }
        }

    }
}

