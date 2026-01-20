import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData} from './lib.js';
import {updateNavbar} from './main.js';
window.onload= function(){
    updateNavbar();
    let user = getUserName();
    let userFirstName = user.firstName;
    let userID = user.uid;
    const welcomeMessage = document.getElementById('welcome');
    const bookedFlights = document.getElementById('bookedFlights');
    welcomeMessage.innerHTML=`Welcome, ${userFirstName}`;

    getData(db, `users/${userID}/bookings`)
        .then(  async (bookings) => {
            bookedFlights.innerHTML = ""
            if (!bookings) {
                bookedFlights.innerHTML = "<p>There are no flights currently</p>";
            return;
            }
            
            for (let path in bookings) {
                let bookingTime = bookings[path]; // The value of each key in the dict is the flight time
                let decodedPath = decodeURIComponent(path); // The key itself is a path which has to be decoded using decodeURIComponent() function

                let flightData = await getData(db, decodedPath);  // Fetch details of each flight using the decoded path
                if (flightData){
                    let departureAirport = decodedPath.split("/")[1]; // Get the departure airport from the path by splitting it using the "/" character and getting the second value
                    let flightDate = decodedPath.split("/")[3] + "/" + 
                                     decodedPath.split("/")[4] + "/" +
                                     decodedPath.split("/")[2]; // Get the flight date from the path by splitting it using the "/" character and concatenating the third, fourth, and fifth values
                    let flightNumber = decodedPath.split("/")[5]; // Get the flight number from the path by splitting it using the "/" character and getting the sixth value
                    let arrivalAirport = flightData.landing_at; // Get the destination airport code using flightData
                    console.log(flightData);
                    const flightCard = document.createElement("div");
                    flightCard.className = "flight-card";
                    flightCard.innerHTML = `
                        <div class="flight-route">
                            <strong>${departureAirport}</strong>   
                            <i class="bi bi-arrow-right-square-fill"></i>   
                            <strong>${arrivalAirport}</strong>
                        </div>
                        <div class="flight-data">
                            <div>Flight ${flightNumber}</div>
                            <div>Date: ${flightDate}</div>
                            <div>Booked on ${new Date(bookingTime).toLocaleDateString()} </div>
                        </div>
                    `;
                    bookedFlights.appendChild(flightCard);
                }
            }          
        }).catch((error) =>{
            console.log(error);
        })


}
