import {app, firebaseConfig,auth,db,getUserName,signOutUser,setData,updateData,getData} from './lib.js';

let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];

async function populateAirportOptions(selectObjectId){
    const selectObject = document.getElementById(selectObjectId);
    for (let i = 0; i < haunted_airport_names.length; i++){
        selectObject.innerHTML +=`<option value="${haunted_airport_names[i]}">${haunted_airport_names[i]}</option>`;
    }
}

window.onload = function(){
    populateAirportOptions('departure-airport-select');
}
