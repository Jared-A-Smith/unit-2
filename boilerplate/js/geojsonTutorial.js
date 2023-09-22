// Add all scripts to the JS folder
// Create map variable and set initial long/lat position and zoom level
var map = L.map('map').setView([39.75621,-104.99404], 13);

// include tile desired tile layer (by URL), define MAX zoom extent and provide citation to source
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create GeoJSON object, a "Feature": ------------------------------------
var geojsonFeature = {
    "type":"Feature",
    "properties":{
        "name":"Coors Field",
        "amenity":"Baseball Stadium",
        "popupContent":"This is where the Rockies play!"
    },
    "geometry":{
        "type":"Point",
        "coordinates":[-104.99404, 39.75621]
    }
};
//ADD GeoJSON object to map using GeoJSON Layer
L.geoJSON(geojsonFeature).addTo(map);

 //ADD object to map using GeoJSON Layer
    /*USE "onEachFeature" function, commonly used to 
    attach a popup to a feature when clicked*/
   /* L.geoJSON(geojsonFeature, {
        onEachFeature:onEachFeature
    }).addTo(map);
    //Create "onEachFeature" function for popup
    function onEachFeature(feature,layer){
        if(feature.properties && feature.properties.popupContent){
            layer.bindPopup(feature.properties.popupContent);
        }
    }*/


//create GeoJSON object passed as an array 
//of GEOJSON objects, a "LineString":
/*var myLines=[{
    "type":"LineString",
    "coordinates":[[-100,40],[-105,45],[-110,55]]
},{
    "type":"LineString",
    "coordinates":[[-105,40],[-110,45],[-115,55]]
}];
L.geoJSON(myLines).addTo(map);*/

//Alternatively, you can create an empty GeoJSON layer
//& assign to a variable so features can be added later
/*var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);*/

//OPTIONS---------------------------------------------
//Style - can be used to style features two ways:
//OPTION1: Pass simple object that styles all paths same
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

//OPTION2: Pass function that styles individual features
//based on their properties. Example below styles based
//on "party" property:

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

// ponitToLayer-------------------------------
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

// onEachFeature Function--------------------------
/*USE "onEachFeature" function, commonly used to 
attach a popup to a feature when clicked*/
    //Create "onEachFeature" function for popup
    function onEachFeature(feature,layer){
        if(feature.properties && feature.properties.popupContent){
            layer.bindPopup(feature.properties.popupContent);
        }
    }

// CREATED EARLIER:
    var geojsonFeature = {
        "type":"Feature",
        "properties":{
            "name":"Coors Field",
            "amenity":"Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry":{
            "type":"Point",
            "coordinates":[-104.99404, 39.75621]
        }
    };

    L.geoJSON(geojsonFeature,{
        onEachFeature:onEachFeature
    }).addTo(map);

//Filter ---------------------------------------
//Filter can control visibility of GeoJSON features
//Pass function as filter option
//Function is called for each feature in GeoJSON layer
//, and gets passed the feature and layer.
//You can use values in features properties
//to control visibility by returning true/false
//"Busch Field" will not be shown
var someFeatures = [{
    "type":"Feature",
    "properties":{
        "name":"Coors Field",
        "show_on_map":true
    },
    "geometry":{
        "type":"Point",
        "coordinates":[-104.99404, 39.75621]
    }
},{
    "type":"Feature",
    "properties": {
        "name":"Busch Field",
        "show_on_map":false
    },
    "geometry":{
        "type":"Point",
        "coordinates":[-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer){
        return feature.properties.show_on_map;
    }
}).addTo(map);


