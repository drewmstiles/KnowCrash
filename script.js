/*
 * drew's script
 */ 

var MAP_MIN_YEAR = 2001;
var MAP_MAX_YEAR = 2009;
var CIRCLE_RADIUS = 2.5;
var MAX_RADIUS = 6.5;
var MIN_RADIUS = 1.5;
var MAX_OPACITY = 0.80;
var MIN_OPACITY = 0.40;
var MAX_RADIUS_M = 2.0;
var MIN_RADIUS_M = 1.0;
var INIT_MAP_ZOOM = 13;

var mapData;
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
			
function showHistoricalMap(endFunction, conditions) {
	
	var mapboxTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
	});

	
	if (map._container == undefined) {
		// Initialize map.
		map = L.map('map', {
		minZoom: 12,
		maxZoom: 15,
		attributionControl: false
		})
		.addLayer(mapboxTiles)
		.setView([33.810335, -118.135071], INIT_MAP_ZOOM);
	}
	else {
		// Map already initialized.
	}
	
	map.on("zoomstart", clean);
	
	map.on("zoomend", draw);
	
	svg = d3.select(map.getPanes().overlayPane).append("svg")
		.attr("height", window.innerHeight)
		.attr("width", window.innerWidth);
	
	var g = svg.append("g").attr("class", "leaflet-zoom-hide");
	
	render(endFunction, conditions);
};

function clean() {

	svg.selectAll("circle").remove();

}

function append(endFunction) {

	svg.selectAll("circle")
		.data(mapData)
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
		})
		.call(endFunction);
}

function draw(endFunction) {

	mapCoordinatesToPixels(mapData);
						
	clean();
	
	append(endFunction);
	
	d3.select("#year")
		.transition()
		.duration(1000)
		.style("color", "white");
}
		
function render(endFunction, conditions) {
	$.get("http://ec2-54-67-114-248.us-west-1.compute.amazonaws.com:8080", conditions, function(data, status) {
		mapData = data;
		draw(endFunction);
	});
}
			
function applyLatLngToLayer(d) {
	var y = d.LATITUDE;
	var x = d.LONGITUDE;
	return map.latLngToLayerPoint(new L.LatLng(y, x))
}

function mapCoordinatesToPixels(dd) {
	for (var i = 0; i < dd.length; i++) {
		var coordinates = applyLatLngToLayer(mapData[i]);
		mapData[i].PIXEL_X = coordinates.x;
		mapData[i].PIXEL_Y = coordinates.y;
	}
}

d3.select("#ctrlMapFilterButton").on("click", function() {

	var year = d3.select("#ctrlMapYear").html();
	
	var severity = d3.select("#ctrlMapSeverity").node();
	var severityValue = severity.options[severity.selectedIndex].value;
	console.log("Severity = " + severityValue);
	
	var factor = d3.select("#ctrlMapFactor").node();
	var factorValue = factor.options[factor.selectedIndex].value;
	console.log("Factor = " + factorValue);
	
	var request = {
		"year" : year,
		"severity" : severityValue,
		"factor" : factorValue
	};
		
	render(function() {}, request);
});

d3.select("#ctrlMapNextYear").on("click", function() {
	var year = parseInt(d3.select("#ctrlMapYear").html());
	
	d3.select("#ctrlMapLastYear").style("opacity", 1.0);
	
	if (year < MAP_MAX_YEAR) {	
		year += 1;
		d3.select("#ctrlMapYear").html(year);
		if (year == MAP_MAX_YEAR) {
			d3.select(this).style("opacity", 0.2);
		}
		else {
			d3.select(this).style("opacity", 1.0);
		}
	}
	else {
		// Already at max year.
	}
});

d3.select("#ctrlMapLastYear").on("click", function() {
	var year = parseInt(d3.select("#ctrlMapYear").html());

	d3.select("#ctrlMapNextYear").style("opacity", 1.0);
	
	if (year > MAP_MIN_YEAR) {	
		year -= 1;
		d3.select("#ctrlMapYear").html(year);
		if (year == MAP_MIN_YEAR) {
			d3.select(this).style("opacity", 0.2);
		
		}
		else {
			d3.select(this).style("opacity", 1.0);
		}
	}
	else {
		// Already at max year.
	}
});


