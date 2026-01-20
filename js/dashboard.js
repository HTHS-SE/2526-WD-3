/*
Author: Sriyan Yarlagadda (neatened a bit by Ethan)
File: dashboard.js
Description: This is the javascript file for the dashboard page. 
It fetches user data from local variables, and fetches flights from the db.
*/

import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData} from './lib.js';
import {updateNavbar} from './main.js';

window.onload= function(){

    updateNavbar();

    //Declare HTML elements to manipulate
    const welcomeMessage = document.getElementById('welcome');
    const importantNotices = document.getElementById('important-notices-container');
    const bookedFlights = document.getElementById('bookedFlights');
    const pastFlights = document.getElementById('pastFlights'); 
    const loyaltyGraph = document.getElementById('loyalty-graph-container'); 
    const accountInformation = document.getElementById('accountInformation'); 

    // Set default values for each section
    bookedFlights.innerHTML = "";
    pastFlights.innerHTML = "";
    loyaltyGraph.innerHTML = "";
    accountInformation.innerHTML = ""; 
    let numFlights = 0;

    // initialize user data from local/session storage
    const user = getUserName();

    //set variables for user info
    let userFirstName = user.firstName;
    let userLastName = user.lastName;
    let userEmail = user.email;
    let lastLogin = user.lastLogin;
    let userID = user.uid; // Get user name and uid

    getData(db, `users/${userID}/bookings`)
    .then(  async (bookings) => {            
        for (let path in bookings) {
            let bookingTime = bookings[path]; // The value of each key in the dict is the flight time
            let decodedPath = decodeURIComponent(path); // The key itself is a path which has to be decoded using decodeURIComponent() function

            let flightData = await getData(db, decodedPath);  // Fetch details of each flight using the decoded path
            
            // make sure flightData exists
            if (flightData){
                let departureAirport = decodedPath.split("/")[1]; // Get the departure airport from the path by splitting it using the "/" character and getting the second value

                let flightDate = decodedPath.split("/")[3] + "/" + 
                                 decodedPath.split("/")[4] + "/" +
                                 decodedPath.split("/")[2]; // Get the flight date from the path by splitting it using the "/" character and concatenating the third, fourth, and fifth values
                
                let flightNumber = decodedPath.split("/")[5]; // Get the flight number from the path by splitting it using the "/" character and getting the sixth value
                
                // Get the destination airport code, gate, pilot, price using flightData
            
                const flightCard = document.createElement("div");
                flightCard.className = "flight-card";

                flightCard.innerHTML = `
                    <div class="flight-route">
                        <strong>${departureAirport}</strong>   
                        <i class="bi bi-arrow-right-square-fill"></i>   
                        <strong>${flightData.landing_at}</strong>
                    </div>
                    <div class="flight-data">
                        <div>Flight ${flightNumber}</div>
                        <div>Date: ${flightDate}</div>
                        <div>Gate: ${flightData.gate}</div>
                        <div>Pilot: ${flightData.pilot}</div>
                        <div>Price: ${flightData.price}</div>
                        <div>Booked on: ${new Date(bookingTime).toLocaleDateString()} </div>
                    </div>
                `; // Create flight card element with inner html to visualize the data retrieved

                //Now that the card has been generated, we need to decide whether to put it in the past flights or booked flights section.

                let [month, day, year] = flightDate.split("/").map(Number); // Get month, day, and year of flight as numbers
                let flightTime = new Date(year, month - 1, day);    // Create date object using year month and day
                
                //Placement based on whether flight date is past or future
                if (flightTime < new Date()){
                    pastFlights.appendChild(flightCard);
                } else {
                    bookedFlights.appendChild(flightCard);
                    numFlights = numFlights + 1;
                }
            }
            
        }  
        
    // Set notices card number. Must be done after for loop to get number of upcoming flights.
    // this was done outside async .then which cause numFlights to always be 0 as it was not awaited properly
    numUpcomingFlights.textContent = `You have ${String(numFlights)} upcoming flights`;

    //END OF THEN BLOCK
    }).catch((error) =>{
        console.log(error); //error fetching bookings

        bookedFlights.innerHTML = "<p>There are no booked flights currently</p>"; // Set to default values for each section
        pastFlights.innerHTML = "<p>There are no  pastflights currently</p>";
        loyaltyGraph.innerHTML = "<p>There is no loyalty data to show for this account</p>";
        accountInformation.innerHTML = "<p>There is no account information to show for tihs account</p>"; // Set default values for each section
    })
    
    // Set notices card. Must be done after for loop to get number of upcoming flights.
    importantNotices.innerHTML = 
    `
        <li class="dashboard-text" id="numUpcomingFlights">You have ${String(numFlights)} upcoming flights</li>
        <li class="dashboard-text">Last login: ${new Date(lastLogin).toLocaleDateString()}</li>
        <li class="dashboard-text">Your Twilight Airlines Loyalty Card is currently inactive</li>
    `;
    
    welcomeMessage.innerHTML=`Welcome, ${userFirstName}`; // Get HTML elements to manipulate using getElementByID
        
    // Set account information card
    accountInformation.innerHTML =
    `
    <div class="account-card mx-auto">
        <p>Name: ${userFirstName} ${userLastName}</p>
        <p>Email: ${userEmail}</p>
        <p>User ID: ${userID}</p>
        <p>Last Login: ${new Date(lastLogin).toLocaleDateString()}</p>
    </div>
    `

}
