import {app, firebaseConfig,auth,db,getUserName,signOutUser,setData,updateData,getData} from './lib.js';

// ---------------- Keep User Logged In ----------------------------------//

let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];

const celebrity_pilots = [
  "Michael Jordan",
  "Lionel Messi",
  "Marilyn Monroe",
  "John Lennon",
  "Pete Davidson",
  "Shaq",
  "Gordon Ramsay",
  "Lizzo",
  "Trisha Paytas"
];

let date= new Date();
let flightnumbers = [];
let flightnum;
let path;
let flying_to;

//int number of days in contained in the current month
let daysInMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();

for (let i = 0; i < haunted_airport_names.length; i++){
    setData(db, 'flights/'+haunted_airport_codes[i], 'Full Name',haunted_airport_names[i]);
    for (let day = 1; day <= daysInMonth; day++){
        flightnumbers = [];
        
        for (let j = 0; j < Math.random()*10; j++){
         
            flightnum = Math.floor(Math.random() * 900) + 100;
            while (flightnumbers.includes(flightnum)){ // I removed the not before this as it was setting it to constantly false, which is an infinite loop as flightnumbers starts empty, and also would cause them to all be dupes
                flightnum = Math.floor(Math.random() * 900) + 100;
            }
            flightnumbers.push(flightnum);

            flying_to=haunted_airport_names.filter(item => item !== haunted_airport_codes[i])[Math.floor(Math.random()*haunted_airport_names.length)];
            console.log('here')
            path='flights/'+haunted_airport_codes[i]+'/'+date.getFullYear()+'/'+date.getMonth()+1 + '/'+ day+'/'+flightnum;
            updateData(db, path, 'status', 'On Time');
            updateData(db, path, 'flight-to',flying_to );
            updateData(db, path, 'landing_at',haunted_airport_codes[haunted_airport_names.indexOf(flying_to)] );
            updateData(db, path, 'departure', (Math.floor(Math.random() * 23) + 1));
            updateData(db, path, 'pilot', celebrity_pilots[Math.floor(Math.random()*celebrity_pilots.length)]);
            updateData(db, path, 'gate', Math.floor(Math.random() * 6))+1;
            updateData(db, path, 'avalable_space', Math.floor(Math.random() * 40))+10;
            updateData(db, path, 'price', Math.round(Math.random() * 40000),3)+999;
        }
    }
}

