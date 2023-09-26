/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map & set initial center and zoom level
    map = L.map('map', {
        center: [38, -96],
        zoom: 4
    });

//ADD tile layer for base map
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map)

    //call getData function
    getData();
};
//loop created to loop through each feature when called and add a popup with feature properties
function onEachFeature(feature,layer){
    var popupContent="";
    if (feature.properties){
        for (var property in feature.properties){
            popupContent +="<p>"+property +": " + feature.properties[property] +"</p>";
        }
        layer.bindPopup(popupContent);
    }
}
//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/CitiesLosingPopulation.geojson")
        .then(function(response){
            return response.json();
        })
        //callback creating feature marker and calling loop to add feature properties pop-up
        .then(function(json){
            //create marker options
            var geojsonMarkerOptions={
                raidus:8,
                fillColor: "#C42D2D",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature,
                pointToLayer: function(feature,latlng){ 
                    return L.circleMarker(latlng, geojsonMarkerOptions);
        
                }
            }).addTo(map);
        })
    };

document.addEventListener('DOMContentLoaded',createMap)