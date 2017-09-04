
var API_URL =  DEBUG ? "http://localhost:5000/api/" : "http://ec2-35-165-254-20.us-west-2.compute.amazonaws.com:5000/api/";	
var MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ';
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

var mapData = [];
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
	
	mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
	
	map = new mapboxgl.Map({
		container: 'map',
		style: 	'mapbox://styles/mapbox/dark-v9',
		center: [-118.135071, 33.810335],
		zoom: 12,
		minZoom: 10,
		maxZoom: 15,
		attributionControl: false
	});
	
	var nav = new mapboxgl.NavigationControl();
	map.addControl(nav, 'top-right');
	
	var mapContainer = map.getCanvasContainer();
	
	
	map.on("zoomstart", clean);
	map.on("zoomend", draw);
	
	map.on("movestart", clean);
	map.on("moveend", draw);
	
	svg = d3.select(mapContainer).append("svg")
		.attr("height", window.innerHeight + "px")
		.attr("width", window.innerWidth + "px");
		
	// Prevent absolutely positioned `mapContainer` from covering.
	svg.style("position", "absolute"); 

	render(endFunction, conditions);
};

var itemPool = [];
function render(endFunction, query) {

	d3.json(API_URL + query, function(error, data) {
	
		if (error) {
		 console.warn(error);
		}
		else {
		
			var items = data['_items'];
			itemPool = itemPool.concat(items);
			var slice = itemPool.length / 10;
			var batchTime = 0;
			while (itemPool.length > 0) {
				slice = itemPool.length > slice ? slice : itemPool.length;
				mapData = mapData.concat(itemPool.slice(0, slice));
				drawAtTime(batchTime++ * 100, mapData);
				itemPool = itemPool.slice(slice);
			}	
			
			endFunction();
			
			if (data['_links'].hasOwnProperty('next')) {
				render(function() {}, data['_links'].next.href) 
			}
			else {
				// No more pages to render.
			}
		}			
	});
}


function drawAtTime(t, items) {
	setTimeout(function() {
		draw(items)
	}, t);
}

function draw(items, endFunction) {

	mapCoordinatesToPixels(items);
	
	append(items, endFunction);
	
	d3.select("#year")
		.transition()
		.duration(1000)
		.style("color", "white");
}


function clean() {
	itemPool = [];
	mapData = [];
	svg.selectAll("circle").remove();
}


function mapCoordinatesToPixels(items) {
	for (var i = 0; i < items.length; i++) {
		var coordinates = applyLatLngToLayer(items[i]);
		items[i]['pixel_x'] = coordinates.x;
		items[i]['pixel_y'] = coordinates.y;
	}
}


function applyLatLngToLayer(item) {
	var y = item['latitude'];
	var x = item['longitude'];
	return map.project(getLngLat(x, y))
}


function getLngLat(x, y) {
	return new mapboxgl.LngLat(x, y);
}


function append(items, endFunction) {
	
	svg.selectAll("circle")
		.data(items)
		.enter()
		.append("circle")
		.attr("cy", function(d) { return d['pixel_y']; })
		.attr("cx",	 function(d) { return d['pixel_x']; })
		.attr("r",  function(d) { 
			var cs = d['collision_severity'];
		
			if (cs == 0) {
				return MIN_RADIUS * zoomToRadiusMultiplierScale(map.getZoom());
			}
			else {
				return deathsToRadiusScale(cs) * zoomToRadiusMultiplierScale(map.getZoom());
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
		.style("fill-opacity", function(d) { 
			var cs = d['collision_severity'];
		
			if (cs == 0) {
				return MIN_OPACITY;
			}
			else {
				return deathsToOpacityScale(cs); 
			}
		})
		.call(function() {
			if ((typeof endFunction) === "function") {
				endFunction();
			}
			else {
				// Can't evaluate a non-function type.
			}
		});
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
	
	clean();
	
	render(callback, histMapGetQuery('long_beach'));
});

d3.select("#ctrlMapYear").on("input", function() {
	d3.select("#selectedYear").html(this.value);
});


/*
 * Query Building
 */
function getCollisionSeverityQuery() {
	var severity = getSelectedOptions('#ctrlMapSeverity');
	return severity == '*' ? null : severity;
}


function getPrimaryCollisionFactorQuery() {
	var factor = getSelectedOption('#ctrlMapFactor');
	return factor == '*' ? null : factor;
}


function getSelectedOption(selector) {
	var node = d3.select(selector).node();
	return node.options[node.selectedIndex].value;
}

function getCollisionDateQuery() {
	
	var yearRange = $("#ctrlMapYear").slider('option', 'values');
	
	var lowerBound = new Date(yearRange[0], 0, 1);
	var upperBound = new Date(yearRange[1], 11, 31);

	return { '$gte' :lowerBound.toUTCString(), '$lte' : upperBound.toUTCString() };
}


function getCollisionTimeQuery() {
	var timeRange = getTimeRange();
	return { '$gte' :timeRange[0], '$lte' : timeRange[1] };
}


function histMapGetQuery(city) {
	var where = {};
	
	var date =  getCollisionDateQuery();
	var time =  getCollisionTimeQuery();
	var severity = getCollisionSeverityQuery();
	var factor = getPrimaryCollisionFactorQuery();
	
	// Date will always be used in query.
	where['datetime'] = date;
	where['collision_time'] = time;
	
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
		'datetime' : 1,
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
