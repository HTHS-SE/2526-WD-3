import {app, firebaseConfig,auth,db,getUserName,signOutUser,setData,updateData,getData} from './lib.js';

let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];

async function populateAirportOptions(selectObjectId){
    const selectObject = document.getElementById(selectObjectId);
    for (let i = 0; i < haunted_airport_names.length; i++){
        selectObject.innerHTML +=`<option value="${haunted_airport_names[i]}">${haunted_airport_names[i]}</option>`;
    }
}

let date = new Date();

window.onload = function(){
    populateAirportOptions('departure-airport-select');
    document.getElementById('start-date').min=date.toISOString().split('T')[0]; //sets the minimum start date to the current date

    this.document.getElementById('get-flights-btn').onclick = function getflights(){
        let startdate = new Date(document.getElementById('start-date').value);
        let finishdate = new Date(document.getElementById('end-date').value);
        let airportDocument = document.getElementById('departure-airport-select').value;
        let airportCode = haunted_airport_codes[haunted_airport_names.indexOf(airportDocument)];
        console.log(`flights/${airportCode}/${startdate.getFullYear()}/${(startdate.getMonth()+1).toString().padStart(2, '0')}/${startdate.getDate()}`)
        console.log(getData(db,`flights/${airportCode}/${startdate.getFullYear()}/${(startdate.getMonth()+1).toString().padStart(2, '0')}/${startdate.getDate()}`));

    }
}
