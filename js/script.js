/*
 * drew's script
 */ 


var data;
var map;
var svg;

window.onload = function() {
	
	var height = window.innerHeight;
	var width = window.innerWidth;
	
	var root = d3.select("#root");	
	root.style("height", height + "px")
	root.style("width", width + "px");

	var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});
	
	map = L.map('map')
		.addLayer(mapboxTiles)
		.setView([33.775335, -118.195071], 12);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", height)
		.attr("width", width);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	d3.csv("lb_out.csv", function(dd) {
		
		data = dd;

		draw();
		
		map.on("zoomstart", function() {
			svg.selectAll("circle").remove();
		});
		
		map.on("zoomend", draw);
	});
};

function draw() {
		
			console.log("exe");
			mapCoordinatesToPixels(data);
						
			svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cy", function(d) { return d.PIXEL_Y; })
				.attr("cx",	 function(d) { return d.PIXEL_X; })
				.attr("r", 7)
				.style("opacity", 0.7)
				.style("fill", "blue")
				.append("title")
				.text(function(d) { 
					var txt = "Primary Road: " + d.PRIMARY_RD + "\n"
						+ "Secondary Road: " + d.SECONDARY_RD; 
					
					return txt;
				});
		}
			
function applyLatLngToLayer(d) {
	var y = d.LATITUDE;
	var x = d.LONGITUDE;
	return map.latLngToLayerPoint(new L.LatLng(y, x))
}

function mapCoordinatesToPixels(dd) {
	for (var i = 0; i < dd.length; i++) {
		var coordinates = applyLatLngToLayer(data[i]);
		data[i].PIXEL_X = coordinates.x;
		data[i].PIXEL_Y = coordinates.y;
	}
}