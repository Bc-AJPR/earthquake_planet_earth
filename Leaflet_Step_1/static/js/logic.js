// Store our API endpoint as queryUrl.
var queryUrl = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // A function to determine the circle size based on the magnitude
    function getRadius(mag)  {
    //console.log(feature.properties.mag);
    return mag * 4
  }

  function getColor(feature){
    //console.log(feature.geometry.coordinates[2]);
    let depth = feature.geometry.coordinates[2];
    let color = "#D8ECBB";
    if      ( depth > 75) { color = "#863D05" }
    else if ( depth > 50) { color = "#C07C42"}
    else if ( depth > 30) { color = "#CD967A" }
    else if ( depth > 15) { color = "#D6B2A1" }
    else if ( depth > 5) { color = "#929A86" }
    return(color)
  }
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude: ${(feature.properties.mag)}<br>Depth: ${(feature.geometry.coordinates[2])}</p>`);
  }
  //create circles features
  function pointToLayer (feature, latlng) {
    return new L.CircleMarker ( latlng, 
                                { radius      : getRadius(feature.properties.mag),
                                  color       : '#555',
                                  fillColor   : getColor(feature),
                                  fillOpacity : 1,
                                  weight      : 1
                                });
  }
  //earthquake layer
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature : onEachFeature});
  createMap(earthquakes);
}
//Create the map
function createMap(earthquakes) {
    // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      10.00, -10.00
    ],
    zoom: 2.5,
    layers: [street, earthquakes]
  });
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend= L.control({position: 'bottomright'});

  legend.onAdd=function(myMap){
      var div = L.DomUtil.create('div','legend');
      var grades=[
          "-10 to +5 - km", "6 - 15 - km", "16 - 30 - km", "31 - 50 - km", "51 - 75 - km", "75+ - km"
      ];
      var colors= [
          '#D8ECBB', '#929A86', '#D6B2A1', '#CD967A', '#C07C42', '#863D05'
      ];
      //create title
      var legendtitle="<h5> Earthquake Depth</h5>";
      div.innerHTML=legendtitle
      // create labels array for legend values
      var labels=[];
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
           grades[i] + (grades[i + 1] ? ""  + "<br>" : "");
          }
          return div;
        };
  legend.addTo(myMap)
}