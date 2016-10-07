/*
 * drew's script
 */ 


var data;
var map;
var svg;

var deathsToColorScale;
var deathsToOpacityScale;
	
window.onload = function() {
	
	var height = window.innerHeight;
	var width = window.innerWidth;
	
	var root = d3.select("#root");	
	root.style("height", height + "px")
	root.style("width", width + "px");
	
	// http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
	var mapboxTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});
	
	map = L.map('map')
		.addLayer(mapboxTiles)
		.setView([33.785335, -118.125071], 12);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", height)
		.attr("width", width);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	d3.csv("lb_out.csv", function(dd) {
		
		dd = dd.filter(function(d) {
			var ret;
			if (d.LATITUDE != "" && d.LONGITUDE != "") {
				ret = true;
			}
			else {
				ret = false;
			}
			
			return ret;
		});
		
		var maxDeaths = d3.max(dd.map(function(d) { return d.NUMBER_KILLED; }));
		
		deathsToColorScale = d3.scale.linear()
			.domain([1, 4])
			.range(["red", "yellow"]);
			
		deathsToOpacityScale = d3.scale.linear()
			.domain([1, 4])
			.range([0.90, 0.25]);
		
		data = dd;

		draw();
		
		map.on("zoomstart", function() {
			svg.selectAll("circle").remove();
		});
		
		map.on("zoomend", draw);
	});
};

function draw() {

			mapCoordinatesToPixels(data);
						
			svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cy", function(d) { return d.PIXEL_Y; })
				.attr("cx",	 function(d) { return d.PIXEL_X; })
				.attr("r", 4)
				.style("opacity", function(d) { 
					var cs = d.COLLISION_SEVERITY;
					if (cs == 0) {
						return 0.2;
					}
					else {
						return deathsToOpacityScale(cs); 
					}
				})
				.style("fill", function(d) { 				
					var cs = d.COLLISION_SEVERITY;
					if (cs == 0) {
						return "blue";
					}
					else {
						return deathsToColorScale(cs); 
					}
				})
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