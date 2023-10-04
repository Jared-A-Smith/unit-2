/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
var minValue;

//Step 1: Create Map
//function to instantiate the Leaflet map
function createMap(){
    //create the map & set initial center and zoom level
    map = L.map('map', {
        center: [38, -96],
        zoom: 4,
    });

//ADD tile layer for base map
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map)

    //call getData function
    getData(map);
};

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only ttake attributes with population values 
        if(attribute.indexOf("PERCENT") > -1){
            attributes.push(attribute);
        };
    };
    //check result
    console.log(attributes)
    return attributes;
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;
            console.log(props);  

            //update each feature's radisu based on new attribtue values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.CITY + "</p>";

            //add formatted attribute to panel content string
            //include conditional statements to dynamically alter popup to identify population LOSS vs. GAIN
            var year = attribute.split("_")[0];
            if (props[attribute]<=0){
                popupContent += "<p><b>Percent Population DECREASE in " + year + ":</b> -" + Math.abs(props[attribute]) + "% </p>";
            }
            else if(props[attribute]>=0){
                popupContent +="<p><b>Percent Population INCREASE in " + year + ":</b> +" + Math.abs(props[attribute]) + "% </p>";
            }
            // console.log(props[attribute]);

            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent).update();
        };
    });
};

function createSequenceControls(attributes){
    //create range input element (slider)
    var slider = "<input class = 'range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeEnd',slider);

    //set slider attributes
    document.querySelector(".range-slider").max = 6;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    //add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse"></button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward"></button>');

    document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src = 'img/back_button.png'>");
    document.querySelector('#forward').insertAdjacentHTML('beforeend', "<img src = 'img/forward_button.png'>");

    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
        var index = document.querySelector('.range-slider').value;

        //Step 6: increment or decrement depending on button clicked
        if (step.id == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to the first attribute
            index = index > 6 ? 0 : index;
        } else if (step.id == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };
        
        //Step 8: update slider
        document.querySelector('.range-slider').value = index;
        //Step 9: pass new button and slider event listener handlers
        updatePropSymbols(attributes[index]);
        })
    })
    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input',function(){
        //Step 6: get the new index value
        var index = this.value;
        //Step 9: pass new button and slider event listener handlers
        updatePropSymbols(attributes[index]);
        // console.log(index);
    });
}; 

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for (var city of data.features){
        //loop through each year
        for(var year = 2016; year <= 2022; year +=1){
            //get population for current year
            var value = city.properties[String(year)+"_PERCENT_CHANGE"];
                //add value to array
                allValues.push(Math.abs(value));
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)
    // console.log(minValue);

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue){
    //constant factor adjusts symbol sizes evenly
    var minRadius = .5;
    //Flannery Appearance Compensation formula
    var radius = 1.0083 * Math.pow(Math.abs(attValue)/minValue, 0.5715) * minRadius

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature,latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    
    //check
    console.log(attribute);

       //Step 4: Determine attribute for scaling the proportional symbols
    // STATIC-----   var attribute = "2021_POP_PERCENT_CHANGE";
    // var netChange = "2021_NET_POP_CHANGE"
       //create marker options
       var geojsonMarkerOptions={
           // radius:8,
           fillColor: "#C42D2D",
           color: "#000",
           weight: 1,
           opacity: 1, 
           fillOpacity: 0.8,
           // radius: 1
       };
       
        //Create variable to identify percent change and set new fill color based on pop gains v.s losses
        // var percentChange = feature.properties[attribute];
        //     // console.log(percentChange);
        //     if (percentChange >=0){
        //        geojsonMarkerOptions.fillColor = "#ffffff";
        //        geojsonMarkerOptions.fillOpacity = .3;
        //         }
        //     else if (percentChange <=0){
        //         geojsonMarkerOptions.fillColor = "#C42D2D";
        //         geojsonMarkerOptions.fillOpacity = 0.5;
        //         }

        //Step 5: For each feature, determine its value for the selected attribute
        var attValue = Number(feature.properties[attribute]);
        
        //Step 6: Give each feature's circle marker a radius based on its attribute value
        geojsonMarkerOptions.radius = calcPropRadius(attValue);

        var marker =
            L.circleMarker(latlng,geojsonMarkerOptions)

        //build popup content string
        var attribute_label = attribute.split("_")[0];
        var popupContent = feature.properties[attribute]
        //create conditional statements to return tailored popup identifying population LOSS vs. GAIN
        if(popupContent >= 0){
            popupContent = "<p><b>City:</b>" + 
            feature.properties.CITY + 
            "</p><p><b>Percent Population INCREASE in " + 
            attribute_label + 
            ": </b> +" + 
            Math.abs(feature.properties[attribute])+
            "% </p>"
        }
        else if (popupContent <= 0){
            popupContent = "<p><b>City:</b>" + 
            feature.properties.CITY + 
            "</p><p><b>Percent Population DECREASE in " + 
            attribute_label + 
            ": </b> -" + 
            Math.abs(feature.properties[attribute])+
            "% </p>"
        }
        //bind the popup to the circle marker
        marker.bindPopup(popupContent, {
            offset: new L.Point(0, -geojsonMarkerOptions.radius)
        });

        //return the circle marker to the L.geoJson pointToLayer option
        return marker;
    };

//Add circle markers for point featurees to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data,{
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 2: Import GeoJSON Data
function getData(map){
    //load the data
    fetch("data/CitiesLosingPopulation.geojson")
        .then(function(response){
            return response.json();
        })
        //callback creating feature marker and calling loop to add feature properties pop-up
        .then(function(json){
            //create an attribute array for sequencing
            var attributes = processData(json);
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
        })
    };

document.addEventListener('DOMContentLoaded',createMap)