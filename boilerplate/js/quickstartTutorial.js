// Add all scripts to the JS folder
// Create map variable and set initial lat/long position and zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// include tile desired tile layer (by URL), define MAX zoom extent and provide citation to source
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add poinnt marker to map at designated lat/long
var marker = L.marker([51.5,-0.09]).addTo(map)

// Add circle to map at designated lat/long and providing options to style
var circle = L.circle([51.508,-0.11],{
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// Add polygon to map at providing lat and long of points connnecting vertices
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

// Add Pop-Ups to features
marker.bindPopup("<b>Hello World!</b><br>I am a pop-up.").openPopup();
circle.bindPopup("I am a circle");
polygon.bindPopup("I am a polygon");

// Set an automatic stand alone pop-up not attached to an object
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

// Set alert message informing user of where at on the map that was clicked in latlong
/*function onMapClick(e){
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);*/

var popup = L.popup();

function onMapClick(e){
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at "  + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);