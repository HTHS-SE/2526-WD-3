/*
Author: Ethan Wellner
File: index.js
This simply initializes the dynamic map on the index page.
*/

//Code Atribution: LeafletJS Quick Start Guide https://leafletjs.com/examples/quick-start/

var map = L.map('map').setView([51.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

for (let i = 0; i < Math.floor(25*Math.random()+6); i++) {
    var circle = L.circle([(Math.random()*120)-60, (Math.random()*360)-180], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50000
    }).addTo(map);
    circle.bindPopup("Unplanned Destination");
    var marker = L.marker([(Math.random()*120)-60, (Math.random()*360)-180]).addTo(map);
    marker.bindPopup("Planned Destination");
}
