/*
 * drew's script
 */ 

var CIRCLE_RADIUS = 2.5;
var MAX_RADIUS = 5.0;
var MIN_RADIUS = 2.0;
var MAX_OPACITY = 0.75;
var MIN_OPACITY = 0.50;
var MAX_RADIUS_M = 1.75;
var MIN_RADIUS_M = 1.0;
var INIT_MAP_ZOOM = 13;

var data;
var map;
var svg;
var severity = "*";
var alcohol = "*";

var deathsToColorScale = d3.scale.linear()
	.domain([1, 4])
	.range(["red", "yellow"]);
			
var deathsToOpacityScale = d3.scale.linear()
	.domain([1, 4])
	.range([MAX_OPACITY,MIN_OPACITY]);
			
var deathsToRadiusScale = d3.scale.linear()
	.domain([1, 4])
	.range([MAX_RADIUS,MIN_RADIUS]);

var zoomToRadiusMultiplierScale = d3.scale.linear()
	.domain([13, 16])
	.range([MAX_RADIUS_M,MIN_RADIUS_M]);
			
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
		.setView([33.810335, -118.135071], INIT_MAP_ZOOM);
	
	map.on("zoomstart", clean);
	
	map.on("zoomend", draw);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", height)
		.attr("width", width);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	render();
};

	
function proprocess(d) {

	var yr = $("#year").html();
	var alc = $("#alc").find(":selected").val();
	var sev = $("#sev").find(":selected").val();
	var run = $("#run").find(":selected").val();
	
	var hasPos = (d.LATITUDE != "" && d.LONGITUDE != "")
	var hasYear = (d.COLLISION_DATE.slice(0,4) == yr);
	var hasSev = (sev == "*" || d.COLLISION_SEVERITY == sev);
	var hasAlc = (alc == "*" || d.ALCOHOL_INVOLVED == alc);
	var hasRun = (run == "*" || d.HIT_AND_RUN == run);
	
	return hasPos && hasYear && hasSev && hasAlc && hasRun;

}

function clean() {

	svg.selectAll("circle")
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
		.attr("r",  function(d) { 
			var cs = d.COLLISION_SEVERITY;
		
			if (cs == 0) {
				return MIN_RADIUS;
			}
			else {
				return deathsToRadiusScale(cs) * zoomToRadiusMultiplierScale(map._zoom);
			}
		});
}

function draw() {

	console.log(map._zoom);
	 
	mapCoordinatesToPixels(data);
						
	clean();
	
	append();
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

$(document).on("click", "#lastYear", function() {
	var yr = $("#year");
	yr.html(parseInt(yr.html()) - 1);
	render();
})

$(document).on("click", "#nextYear", function() {
	var yr = $("#year");
	yr.html(parseInt(yr.html()) + 1);
	render();
})

$(document).on("change", "#sev", render)

$(document).on("change", "#alc", render);

$(document).on("change", "#run", render);

