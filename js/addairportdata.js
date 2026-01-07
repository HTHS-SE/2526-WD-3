import {app, firebaseConfig,auth,db,getUserName,signOutUser,setData,updateData,getData} from './lib.js';

// ---------------- Keep User Logged In ----------------------------------//

let haunted_airport_names = ['Denver International','Daniel K. Inouye','Savvanah-Hilton Head','O\'Hare','Old Kai Tak'];

let haunted_airport_codes = ['DEN','HNL','SAV','ORD','HKG'];

const celebrity_pilots = [
  "Michael Jordan",
  "Lionel Messi",
  "Marilyn Monroe",
  "John Lennon",
  "Paul McCartney",
  "Ian McKellen",
  "Patrick Stewart",
  "Chrissy Teigen",
  "David Beckham",
  "Victoria Beckham"
];

let date= new Date();
let flightnumbers = [];
let flightnum;
let path;

//int number of days in contained in the current month
let daysInMonth = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();

for (let i = 0; i < haunted_airport_names.length; i++){
    setData(db, 'flights/'+haunted_airport_codes[i], 'Full Name',haunted_airport_names[i]);
    console.log(i);
    for (let day = 1; day <= daysInMonth; day++){
        flightnumbers = [];
        
        console.log('Adding flights for ' + haunted_airport_codes[i] + ' on ' + date.getMonth() + '/' + day + '/' + date.getFullYear());
        for (let j = 0; j < Math.random()*10; j++){
            
            flightnum = Math.floor(Math.random() * 900) + 100;
            while (!flightnumbers.includes(flightnum)){
                flightnum = Math.floor(Math.random() * 900) + 100;
            }
            flightnumbers.push(flightnum);
            console.log('here')
            path='flights/'+haunted_airport_codes[i]+'/'+date.getFullYear()+'/'+date.getMonth() + '/'+ day+'/'+flightnum;
            setData(db, path, 'status', 'On Time');
            setData(db, path, 'flight to', haunted_airport_names.filter(item => item !== haunted_airport_codes[i])[Math.floor(Math.random()*haunted_airport_names.length)]);
            setData(db, path, 'departure', (Math.floor(Math.random() * 23) + 1));
            setData(db, path, 'pilot', celebrity_pilots[Math.floor(Math.random()*celebrity_pilots.length)]);
            setData(db, path, 'gate', Math.floor(Math.random() * 6));
            console.log('Added flight ' + flightnum + ' to ' + haunted_airport_codes[i] + ' on ' + date.getMonth() + '/' + day + '/' + date.getFullYear());
        }
    }
}

