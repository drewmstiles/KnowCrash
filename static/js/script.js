
var API_URL = "http://ec2-35-165-254-20.us-west-2.compute.amazonaws.com:5000/api/";		

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
		attributionControl: false,
		zoomControl: false
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



function render(endFunction, query) {

	d3.json(API_URL + query, function(error, data) {
	
		if (error) {
		 console.warn(error);
		}
		else {
			console.log(data);
			mapData = data['_items'];
			draw(endFunction);
		}			
	});
}


function draw(endFunction) {

	clean();
	
	mapCoordinatesToPixels(mapData);
	
	append(endFunction);
	
	d3.select("#year")
		.transition()
		.duration(1000)
		.style("color", "white");
}


function clean() {
	svg.selectAll("circle").remove();
}


function mapCoordinatesToPixels(dd) {
	for (var i = 0; i < dd.length; i++) {
		var coordinates = applyLatLngToLayer(mapData[i]);
		mapData[i]['pixel_x'] = coordinates.x;
		mapData[i]['pixel_y'] = coordinates.y;
	}
}


function applyLatLngToLayer(d) {
	var y = d['latitude'];
	var x = d['longitude'];
	return map.latLngToLayerPoint(new L.LatLng(y, x))
}


function append(endFunction) {

	svg.selectAll("circle")
		.data(mapData)
		.enter()
		.append("circle")
		.attr("cy", function(d) { return d['pixel_y']; })
		.attr("cx",	 function(d) { return d['pixel_x']; })
		.style("opacity", function(d) { 
			var cs = d['collision_severity'];
		
			if (cs == 0) {
				return MIN_OPACITY;
			}
			else {
				return deathsToOpacityScale(cs); 
			}
		})
		.style("fill", function(d) { 				
			var cs = d['collision_severity'];
			if (cs == 0) {
				return "white";
			}
			else {
				return deathsToColorScale(cs); 
			}
		})
		.attr("r",  function(d) { 
			var cs = d['collision_severity'];
		
			if (cs == 0) {
				return MIN_RADIUS * zoomToRadiusMultiplierScale(map._zoom);
			}
			else {
				return deathsToRadiusScale(cs) * zoomToRadiusMultiplierScale(map._zoom);
			}
		})
		.call(endFunction);
}
	

/*
 * Event Handling
 */	

d3.select("#ctrlMapFilterButton").on("click", function() {

	d3.select(this).html("Loading");
		
	var loadInterval = setInterval(function() {
		var elem = d3.select("#ctrlMapFilterButton");
		var html = elem.html();
		if (html == "Loading...") {
			elem.html("Loading");
		}
		else {
			elem.html(html + ".");
		}
	}, 1000);
			
	var callback = function() { 
		clearInterval(loadInterval); 
		d3.select("#ctrlMapFilterButton").html("Filter");
	};
	
	render(callback, histMapGetQuery('long_beach'));
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


/*
 * Query Building
 */
function getCollisionSeverityQuery() {
	
	var node = d3.select("#ctrlMapSeverity").node();
	var severity = node.options[node.selectedIndex].value;
	
	return severity == '*' ? null : severity;
}


function getPrimaryCollisionFactorQuery() {
	
	var node = d3.select("#ctrlMapFactor").node();
	var factor = node.options[node.selectedIndex].value;
	
	return factor == '*' ? null : factor;
}


function getCollisionDateQuery() {
	var year = d3.select("#ctrlMapYear").html();
	return { '$regex' : '^' + year };
}


function histMapGetQuery(city) {
	var where = {};
	
	var date =  getCollisionDateQuery();
	var severity = getCollisionSeverityQuery();
	var factor = getPrimaryCollisionFactorQuery();
	
	// Date will always be used in query.
	where['collision_date'] = date;
	
	if (severity != null) {
		where['collision_severity'] = severity;
	}
	else {
		// nada
	}
	
	if (factor != null) {
		where['pcf_viol_category'] = factor;
	}
	else {
		// nada
	}
	
	project = {
		'collision_severity' : 1,
		'collision_date' : 1,
		'primary_coll_factor' : 1,
		'latitude' : 1,
		'longitude' : 1
	};
	
	return buildQuery(city, where, project)
}


function buildQuery(city, where, project) {
	return city 
	+ '?where=' + JSON.stringify(where) 
	+ '&projection=' + JSON.stringify(project);
}
