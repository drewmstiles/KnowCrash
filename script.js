/*
 * drew's script
 */ 

var CIRCLE_RADIUS = 2.5;
var MAX_RADIUS = 6.5;
var MIN_RADIUS = 1.5;
var MAX_OPACITY = 0.80;
var MIN_OPACITY = 0.40;
var MAX_RADIUS_M = 2.0;
var MIN_RADIUS_M = 1.0;
var INIT_MAP_ZOOM = 13;

var data;
var map;
var svg;
var severity = "*";
var alcohol = "*";

var deathsToColorScale = d3.scaleLinear()
	.domain([1, 4])
	.range(["red", "yellow"]);
			
var deathsToOpacityScale = d3.scaleLinear()
	.domain([1, 4])
	.range([MAX_OPACITY,MIN_OPACITY]);
			
var deathsToRadiusScale = d3.scaleLinear()
	.domain([1, 4])
	.range([MAX_RADIUS,MIN_RADIUS]);

var zoomToRadiusMultiplierScale = d3.scaleLinear()
	.domain([15, 12])
	.range([MAX_RADIUS_M,MIN_RADIUS_M]);
			
window.onload = function() {
	
	var mapboxTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});
	
	map = L.map('map', {
		minZoom: 12,
		maxZoom: 15
		})
		.addLayer(mapboxTiles)
		.setView([33.810335, -118.135071], INIT_MAP_ZOOM);
	
	map.on("zoomstart", clean);
	
	map.on("zoomend", draw);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", window.innerHeight)
		.attr("width", window.innerWidth);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	render();
};

	
function proprocess(d) {

	var yrr = $("#year").html();
	var sev = $("#sev").find(":selected").val();
	var fac = $("#fac").find(":selected").val();
	
	var hasPos = (d.LATITUDE != "" && d.LONGITUDE != "");
	var hasYrr = (d.COLLISION_DATE.slice(0,4) == yrr);
	var hasSev = (sev == "*" || d.COLLISION_SEVERITY == sev);
	var hasFac = (fac == "*" || d.PCF_VIOL_CATEGORY == fac);
	
	return hasPos && hasYrr && hasSev && hasFac;

}

function clean() {

	svg.selectAll("circle").remove();

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
		.attr("r",  function(d) { 
			var cs = d.COLLISION_SEVERITY;
		
			if (cs == 0) {
				return MIN_RADIUS * zoomToRadiusMultiplierScale(map._zoom);
			}
			else {
				return deathsToRadiusScale(cs) * zoomToRadiusMultiplierScale(map._zoom);
			}
		});
}

function draw() {

	mapCoordinatesToPixels(data);
						
	clean();
	
	append();
	
	d3.select("#year")
		.transition()
		.duration(1000)
		.style("color", "white");
}
		
function render() {
	d3.csv("lb_all.csv", function(dd) {
		
		data = dd.filter(function(d) {
			return proprocess(d);
		});

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

