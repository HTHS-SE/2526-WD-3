import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData, removeData} from './lib.js';
import {updateNavbar} from './main.js';
window.onload= function(){
    updateNavbar(); // Include updateNavbar in window.onload function so it still runs
    const welcomeMessage = document.getElementById('welcome');
    const importantNotices = document.getElementById('important-notices-container');
    const bookedFlights = document.getElementById('bookedFlights');
    const pastFlights = document.getElementById('pastFlights'); 
    const loyaltyGraph = document.getElementById('loyalty-graph-container'); 
    const accountInformation = document.getElementById('accountInformation'); 
     // Get each of the major sections of the dashboard pages by element and store them in a variable to access later

    bookedFlights.innerHTML = "";
    pastFlights.innerHTML = "";
    loyaltyGraph.innerHTML = "";
    accountInformation.innerHTML = "";

    let user = getUserName();
    let userFirstName = user.firstName;
    let userLastName = user.lastName;
    let userEmail = user.email;
    let lastLogin = user.lastLogin;
    let userID = user.uid; // Get user fire name, last name, email, last login, and uid

    getData(db, `users/${userID}/bookings`)
        .then(  async (bookings) => {            
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
                    let arrivalAirport = flightData["flight-to"];
                    let gate = flightData.gate; 
                    let pilot = flightData.pilot; 
                    let price = flightData.price; 
                    let time = flightData.departure;
                    // Get the destination airport code, gate, pilot, price using flightData
                
                    const flightCard = document.createElement("div");
                    flightCard.className = "flight-card"; // Create flight card element
                    flightCard.innerHTML = 
                    `
                        <div class="card bg-dark text-light shadow-lg rounded-4 p-4">
                            <div class="row align-items-center">
                                <div class="col-md-4 text-center text-md-start mb-4 mb-md-0">
                                    <div style="text-align: center;">
                                        <h4 class="booked-flight-header">
                                            <i class="bi bi-airplane-fill me-2"></i>
                                            Flight to ${flightData['flight-to']}
                                        </h4>
                                    </div>
                                    <div class="booked-flight-text">
                                        <p class="mb-2">
                                            <i class="bi bi-geo-alt-fill"></i>
                                            <strong>Dep Airport:</strong> ${departureAirport}
                                        </p>
                                        <p class="mb-2">
                                            <i class="bi bi-alarm-fill me-2"></i>
                                            <strong>Dep Time:</strong> ${time}:00
                                        </p>
                                        <p class="mb-2">
                                            <i class="bi bi-calendar-fill me-2"></i>
                                            <strong>Date:</strong> ${flightDate}
                                        </p>
                                        <p class="mb-2">
                                            <i class="bi bi-door-closed-fill"></i>
                                            <strong>Gate:</strong> ${gate}
                                        </p>
                                        <p class="mb-0">
                                            <i class="bi bi-person-badge me-2"></i>
                                            <strong>Pilot:</strong> ${pilot}
                                        </p>
                                    </div>
                                </div>

                                <div class="col-md-4 text-center mb-4 mb-md-0">
                                    <img 
                                        src="./img/${flightData['landing_at']}.jpg"
                                        alt="Arrival Airport"
                                        class="booked-flight-image"
                                        style="max-height: 200px; object-fit: cover;">
                                </div>

                                <div class="col-md-4 text-center">
                                    <h2 class="booked-flight-text">
                                        $${Math.round(parseInt(flightData['price'], 10) / 100) * 100}
                                    </h2>
                                    <p class="booked-flight-text">Luxury Guaranteed!</p>

                                    <button 
                                        type="button"
                                        id="cancel-button-${flightNumber}"
                                        class="cancel-button">
                                        Cancel Flight
                                    </button>
                                </div>

                            </div>
                        </div>

                    `;// Create flight card with inner html that shows the flight data, and add css classes to style it


                    let [month, day, year] = flightDate.split("/").map(Number); // Get month, day, and year of flight as numbers
                    let flightTime = new Date(year, month - 1, day);    // Create date object using year month and day
                    let currentTime = new Date();  
                    currentTime.setHours(0, 0, 0, 0);     // Create date object for current time

                    if (flightTime < currentTime){
                        pastFlights.appendChild(flightCard); 
                        const cancelButton = document.getElementById(`cancel-button-${flightNumber}`);
                        cancelButton.innerHTML = "Hope you enjoyed!";
                        // If the flight was before today, add to past flights section and set text for cancel button
                    } else {
                        bookedFlights.appendChild(flightCard);  // If the flight is after today, add it to upcoming flights section and set onclick function for cancel button
                        const cancelButton = document.getElementById(`cancel-button-${flightNumber}`);
                        cancelButton.onclick = function (){ // Function to cancel flight
                            let path = "users/" + userID + "bookings/" + flightNumber;
                            removeData(db, path);
                            alert("Flight removed");
                            window.location.reload()
                        }
                    }
                }
            }  
            
            let loginDate = new Date(lastLogin);
            const dateString = loginDate.toLocaleDateString();
            console.log(dateString); // Get last login date as a readable string
            welcomeMessage.innerHTML=`Welcome, ${userFirstName}`; // Set welcome message at the top
            importantNotices.innerHTML=
            `
            <li class="dashboard-text">You have ${bookedFlights.childElementCount} upcoming flights</li>
            <li class="dashboard-text">Last login: ${dateString}</li>
            <li class="dashboard-text">Your Twilight Airlines Loyalty Card is currently inactive</li>
            `
            // Set important notice section below the header
            accountInformation.innerHTML=
            `
            <div class="account-card mx-auto">
                <p>Name: ${userFirstName} ${userLastName}</p>
                <p>Email: ${userEmail}</p>
                <p>User ID: ${userID}</p>
                <p>Last Login: ${dateString}</p>
            </div>
            `
        }).catch((error) =>{
            console.log(error);
            bookedFlights.innerHTML = "<p>There are no booked flights currently</p>"
            pastFlights.innerHTML = "<p>There are no  pastflights currently</p>"
            loyaltyGraph.innerHTML = "<p>There is no loyalty data to show for this account</p>"
            accountInformation.innerHTML = "<p>There is no account information to show for tihs account</p>" // Set error values for each section
        })
    
    

    // Set account information section at the bottom


}
