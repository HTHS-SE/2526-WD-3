import {app, firebaseConfig, auth, db, getUserName, signOutUser, setData, updateData, getData} from './lib.js';
import {updateNavbar} from './main.js';

window.onload= function(){
    updateNavbar();
    const welcomeMessage = document.getElementById('welcome');
    const importantNotices = document.getElementById('important-notices-container');
    const bookedFlights = document.getElementById('bookedFlights');
    const pastFlights = document.getElementById('pastFlights'); 
    const loyaltyGraph = document.getElementById('loyalty-graph-container'); 
    const accountInformation = document.getElementById('accountInformation'); 

    bookedFlights.innerHTML = "";
    pastFlights.innerHTML = "";
    //loyaltyGraph.innerHTML = ""; // !! I commented because it causes errors with the chart !!
    accountInformation.innerHTML = ""; // Set default values for each section
    let numFlights = 0;

    let user = getUserName();
    let userFirstName = user.firstName;
    let userLastName = user.lastName;
    let userEmail = user.email;
    let lastLogin = user.lastLogin;
    let userID = user.uid; // Get user name and uid

    getData(db, `users/${userID}/accountInfo/active-loyalty-member`)
    .then((isActive) => {
        const loyaltyStatus = document.getElementById("loyalty-status");
        if (!loyaltyStatus) {
            return;
        } if (isActive === true) {
            loyaltyStatus.textContent = "Active";
        } else {
            loyaltyStatus.textContent = "Not Active";
        }
    })
    .catch((error) => {
        console.log(error);
        const loyaltyStatus = document.getElementById("loyalty-status");
        if (loyaltyStatus) loyaltyStatus.textContent = "Not Active";
    });



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
                    let arrivalAirport = flightData.landing_at;
                    let gate = flightData.gate; 
                    let pilot = flightData.pilot; 
                    let price = flightData.price; 
                    
                    // Get the destination airport code, gate, pilot, price using flightData
                
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
                            <div>Gate: ${gate}</div>
                            <div>Pilot: ${pilot}</div>
                            <div>Price: ${price}</div>
                            <div>Booked on: ${new Date(bookingTime).toLocaleDateString()} </div>
                        </div>
                    `; // Create flight card element with inner html to visualize the data retrieved

                    let [month, day, year] = flightDate.split("/").map(Number); // Get month, day, and year of flight as numbers
                    let flightTime = new Date(year, month - 1, day);    // Create date object using year month and day
                    let currentTime = new Date();  
                    currentTime.setHours(0, 0, 0, 0);     // Create date object for current time

                    if (flightTime < currentTime){
                        pastFlights.appendChild(flightCard);
                    } else {
                        bookedFlights.appendChild(flightCard);
                        numFlights = numFlights + 1;
                    }
                }
            }          
        }).catch((error) =>{
            console.log(error);
            bookedFlights.innerHTML = "<p>There are no booked flights currently</p>"
            pastFlights.innerHTML = "<p>There are no  pastflights currently</p>"
            loyaltyGraph.innerHTML = "<p>There is no loyalty data to show for this account</p>"
            accountInformation.innerHTML = "<p>There is no account information to show for tihs account</p>" // Set default values for each section
        })
    
    
    let loginDate = new Date(lastLogin);
    const dateString = loginDate.toLocaleDateString();
    console.log(dateString);

    welcomeMessage.innerHTML=`Welcome, ${userFirstName}`; // Get HTML elements to manipulate using getElementByID
    importantNotices.innerHTML=
    `
    <li class="dashboard-text">You have ${numFlights} upcoming flights</li>
    <li class="dashboard-text">Last login: ${dateString}</li>
    <li class="dashboard-text">Your Twilight Airlines Loyalty Card is currently inactive</li>
    `
    accountInformation.innerHTML=
    `
    <div class="account-card">
        <p>Name: ${userFirstName} ${userLastName}</p>
        <p>Email: ${userEmail}</p>
        <p>User ID: ${userID}</p>
        <p>Last Login: ${dateString}</p>
    </div>
    `
    console.log("<div class=account-card");


}