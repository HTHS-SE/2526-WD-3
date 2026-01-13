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
        .then((bookings) => {
            if (!bookings) {
                bookedFlights.innerHTML = "There are no flights currently";
            return;
            } else {
                bookedFlights.innerHTML = "Your flights: " + JSON.stringify(bookings);
            }
        }).catch((error) =>{
            alert(error);
        })


}
