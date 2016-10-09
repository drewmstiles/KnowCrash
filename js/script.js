/*
 * drew's script
 */ 

var CIRCLE_RADIUS = 2.5;
var MAX_RADIUS = 5.0;
var MIN_RADIUS = 2.0;
var MAX_OPACITY = 1.00;
var MIN_OPACITY = 0.50;
var data;
var map;
var svg;

var deathsToColorScale = d3.scale.linear()
	.domain([1, 4])
	.range(["red", "yellow"]);
			
var deathsToOpacityScale = d3.scale.linear()
	.domain([1, 4])
	.range([MAX_OPACITY,MIN_OPACITY]);
			
var deathsToRadiusScale = d3.scale.linear()
	.domain([1, 4])
	.range([MAX_RADIUS,MIN_RADIUS]);

			
window.onload = function() {
	
	var height = window.innerHeight;
	var width = window.innerWidth;
	
	var root = d3.select("#root");	
	root.style("height", height + "px")
	root.style("width", width + "px");
	
	var mapboxTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});
	
	map = L.map('map')
		.addLayer(mapboxTiles)
		.setView([33.810335, -118.135071], 13);
	
	map.on("zoomstart", clean);
	
	map.on("zoomend", draw);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", height)
		.attr("width", width);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	render();
};

	
function proprocess(d) {
	var include = false
	var hasCoords = (d.LATITUDE != "" && d.LONGITUDE != "")
	var isYear = (d.COLLISION_DATE.slice(0,4) == getYear());
	return hasCoords && isYear;

}

function getYear() {
	return d3.select("#year").html();
}

function setYear(yr) {
	d3.select("#year").html(yr);
}

function clean() {

	svg.selectAll("circle")
// 		.transition()
// 		.duration(1000)
// 		.attr("r", 0)
		.remove();

}

function append() {

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cy", function(d) { return d.PIXEL_Y; })
		.attr("cx",	 function(d) { return d.PIXEL_X; })
		.style("opacity", function(d) { 
			var cs = d.COLLISION_SEVERITY;
		
			if (cs == 0) {
				return MIN_OPACITY;
			}
			else {
				return deathsToOpacityScale(cs); 
			}
		})
		.style("fill", function(d) { 				
			var cs = d.COLLISION_SEVERITY;
			if (cs == 0) {
				return "white";
			}
			else {
				return deathsToColorScale(cs); 
			}
		})
// 		.attr("r", 0)
// 		.transition()
// 		.duration(1000)
		.attr("r",  function(d) { 
			var cs = d.COLLISION_SEVERITY;
		
			if (cs == 0) {
				return MIN_RADIUS;
			}
			else {
				return deathsToRadiusScale(cs); 
			}
		});
}

function draw() {

	mapCoordinatesToPixels(data);
						
	clean();
	
	append();
}

		
function render() {
	d3.csv("lb_all.csv", function(dd) {
		
		data = dd.filter(function(d) {
			return proprocess(d);
		});
		
		console.log(data.length);

		draw();
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

$(document).on("click", "#lastYear", function() {
	console.log("click");
	setYear(parseInt(getYear()) - 1);
	render();
});

$(document).on("click", "#nextYear", function() {
	setYear(parseInt(getYear()) + 1);
	render();
});