/*
Author: Sriyan Yarlagadda (neatened and debugged a bit by Ethan) and loyalty is max
File: dashboard.js
Description: This is the javascript file for the dashboard page. 
It fetches user data from local variables, and fetches flights from the db.
*/

import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData, removeData} from './lib.js';
import {updateNavbar} from './main.js';

window.onload= function(){
    updateNavbar(); // Include updateNavbar in window.onload function so it still runs
    //Declare HTML elements to manipulate
    const welcomeMessage = document.getElementById('welcome');
    const importantNotices = document.getElementById('important-notices-container');
    const bookedFlights = document.getElementById('bookedFlights');
    const pastFlights = document.getElementById('pastFlights'); 
    const loyaltyGraph = document.getElementById('loyalty-graph-container'); 
    const accountInformation = document.getElementById('accountInformation'); 
     // Get each of the major sections of the dashboard pages by element and store them in a variable to access later

    // Set default values for each section
    bookedFlights.innerHTML = "";
    pastFlights.innerHTML = "";
    //loyaltyGraph.innerHTML = ""; // !! I commented because it causes errors with the chart !!
    accountInformation.innerHTML = ""; 
    let numFlights = 0;

    // initialize user data from local/session storage
    const user = getUserName();

    //set variables for user info
    let userFirstName = user.firstName;
    let userLastName = user.lastName;
    let userEmail = user.email;
    let lastLogin = user.lastLogin;
    let userID = user.uid; // Get user fire name, last name, email, last login, and uid

    //get info from db to see if user is a member of the loyalty program
    getData(db, `users/${userID}/accountInfo/active-loyalty-member`)
    .then((isActive) => { //isactive is a bool
        const loyaltyStatus = document.getElementById("loyalty-status");

        if (isActive) {
            loyaltyStatus.textContent = "Active"; //user is active
        } else {
            loyaltyStatus.textContent = "Not Active";
        }
    })
    .catch((error) => {
        console.log(error);

        const loyaltyStatus = document.getElementById("loyalty-status");
        if (loyaltyStatus) { 
            loyaltyStatus.textContent = "Not Active";
        }
    });


    getData(db, `users/${userID}/bookings`)
    .then(  async (bookings) => {            
        for (let path in bookings) {
            let urlEncodedPath = path; // The key itself is a path which has to be encoded using encodeURIComponent() function
            let decodedPath = decodeURIComponent(path); // The key itself is a path which has to be decoded using decodeURIComponent() function

            let flightData = await getData(db, decodedPath);  // Fetch details of each flight using the decoded path
            
            // make sure flightData exists
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
                `; 
                // Create flight card element with inner html to visualize the data retrieved

                //Now that the card has been generated, we need to decide whether to put it in the past flights or booked flights section.

                let [month, day, year] = flightDate.split("/").map(Number); // Get month, day, and year of flight as numbers
                let flightTime = new Date(year, month - 1, day);    // Create date object using year month and day
                
                //Placement based on whether flight date is past or future
                if (flightTime < new Date()){
                    pastFlights.appendChild(flightCard); 
                    const cancelButton = document.getElementById(`cancel-button-${flightNumber}`);
                    cancelButton.innerHTML = "Hope you enjoyed!";
                    // If the flight was before today, add to past flights section and set text for cancel button
                } 
                
                else {

                    bookedFlights.appendChild(flightCard);  // If the flight is after today, add it to upcoming flights section and set onclick function for cancel button
                    const cancelButton = document.getElementById(`cancel-button-${flightNumber}`);

                    cancelButton.onclick = function (){ // Function to cancel flight
                        let rmpath = "users/" + userID + "/bookings/" + urlEncodedPath;
                        console.log("Removing flight at path: " + rmpath);
                        removeData(db, rmpath);
                        alert("Flight removed");
                        window.location.reload()
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
            }
        }  
        
        // Set notices card number. Must be done after for loop to get number of upcoming flights.
        // this was done outside async .then which cause numFlights to always be 0 as it was not awaited properly
        // DO NOT COMMENT OUT. It must be edit here after we get the info. Read above.
        const numUpcomingFlights=document.getElementById("numUpcomingFlights");
        numUpcomingFlights.textContent = `You have ${String(numFlights)} upcoming flights`;

        //END OF THEN BLOCK
    })
    .catch((error) =>{
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
        <p><strong>Name:</strong> ${userFirstName} ${userLastName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>User ID:</strong> ${userID}</p>
        <p><strong>Last Login:</strong> ${new Date(lastLogin).toLocaleDateString()}</p>
        <hr>
        <p><input 
            type="text" 
            placeholder="Change First Name"
            id="updateFirstName">
        </p>
        <p><input 
            type="text" 
            placeholder="Change Last Name"
            id="updateLastName"
            >
        </p>
        <p><input 
            type="email" 
            placeholder="Change Email"
            id="updateEmail"
            >
        </p>
        <p>
            <button id="updateAccountInfo">Save Changes</button>
        </p>
    </div>
    `

    const updateData = document.getElementById("updateAccountInfo");
    updateData.onclick = function (){ // Checks each value, makes sure it is valid, then updates in database
        console.log("")
        let firstName = document.getElementById("updateFirstName").value.trim(); 
        let lastName = document.getElementById("updateLastName").value.trim(); 
        let email = document.getElementById("updateEmail").value.trim(); 

        if (firstName === "") {
            // Do nothing if a field is left blank
        } else if (!/^[A-Za-z]{3,}$/.test(firstName)) {
            // First name should be at least three letters, no numbers or symbols
            alert("Invalid first name.");
        } else {
            let rmpath = "users/" + userID + "/accountInfo/";
            updateData(db, rmpath, "firstName", firstName);
        }

        if (lastName === "") {
            // Do nothing if a field is left blank
        } else if (!/^[A-Za-z]{3,}$/.test(lastName)) {
            // Last name should be at least three letters, no numbers or symbols
            alert("Invalid last  name.");
        } else {
            let rmpath = "users/" + userID + "/accountInfo/";
            updateData(db, rmpath, "lastName", lastName);
        }

        if (email === "") {
            // Do nothing if a field is left blank
        } else if (
            // Email should be at least 5 characters, can have letters and numbers, and must have the @ symbol
            email.length < 5 ||
            !/^[A-Za-z0-9]+@[A-Za-z0-9]+$/.test(email)
        ) {
            alert("Invalid email address");
            return false;
        }
    }
}
