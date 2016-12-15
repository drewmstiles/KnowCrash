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

var fdata;
var fmap;
var fsvg;
	
var futureMapProbToOpacityScale = d3.scaleLinear()
	.domain([0.0, 0.05])
	.range([0.0,1.0]);		
	
var futureMapProbToColorScale = d3.scaleLinear()
	.domain([0.01, 0.07])
	.range(["blue","red"]);

var zoomToRadiusMultiplierScale = d3.scaleLinear()
	.domain([15, 12])
	.range([MAX_RADIUS_M,MIN_RADIUS_M]);
			
function showFuture(request, callback) {
	
	var fmapboxTiles = new L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
    });

	
	fmap = L.map('futureMap', {
		minZoom: 12,
		maxZoom: 15
		})
		.addLayer(fmapboxTiles)
		.setView([33.810335, -118.135071], 13);
	
	fmap.on("zoomstart", clean);
	
	fmap.on("zoomend", draw);
	
	fsvg = d3.select(fmap.getPanes().overlayPane).append("svg")
		.attr("height", window.innerHeight)
		.attr("width", window.innerWidth);
	
	var fg = fsvg.append("g").attr("class", "leaflet-zoom-hide");
	
	renderf(request, callback);
};

function cleanf() {

	fsvg.selectAll("g").remove();

}

function appendf(callback) {

	console.log("appended");
	
	var nodes = fsvg.selectAll("g")
		.data(fdata)
		.enter()
		.append("g")
			.attr("transform", function(d) {
				return "translate(" + d.PIXEL_X + "," + d.PIXEL_Y + ")";
		});
		
		
		nodes.append("circle")
			.style("opacity",function(d) { return futureMapProbToOpacityScale(d.PROB) })
			.style("fill", function(d) { return futureMapProbToColorScale(d.PROB) })
			.attr("r",  10)
			.call(callback);
			
// 		nodes.append("text")
// 			.text(function(d) { return Number(d.PROB * 100).toFixed(2); })
// 			.style("fill", "white")
// 			.style("text-anchor", "middle")
// 			.style("font-size", "10px")
// 			.attr("dy", "3px")
// 			.style("font-weight", "bold")
		
		// Here render to screen
}

function drawf(callback) {

	mapCoordinatesToPixelsf(fdata);
						
	cleanf();
	
	appendf(callback);
}
		
function renderf(request, callback) {
	
	d3.csv("lb_map.csv", function(dd) {
		$.get("http://ec2-54-67-114-248.us-west-1.compute.amazonaws.com:8080", request, function(predictions, status) {
	
			var latLongMap = {};
			for (var i = 0; i < dd.length; i++) {
				var d = dd[i];
				latLongMap[d.INTER] = [d.LAT, d.LONG];
			};
		
			var formattedPredictions = [];
			var i = 0;
			for (property in predictions) {
				var coords = latLongMap[property];
				formattedPredictions[i++] = {
					"INTER" : property,
					"LATITUDE" : coords[0],
					"LONGITUDE" : coords[1],
					"PROB" : predictions[property]
				}
			}
			
						console.log(formattedPredictions);
			fdata = formattedPredictions;
			drawf(callback);
			});
		});
}
	
function poisson(count) {
	var lambda = count / (365 * 10);
	return ((lambda) * (1 / Math.E))
}	
	
function applyLatLngToLayerf(d) {
	var y = parseFloat(d.LATITUDE);
	var x = parseFloat(d.LONGITUDE);
	return fmap.latLngToLayerPoint(new L.LatLng(y, x))
}

function mapCoordinatesToPixelsf(dd) {
	for (var i = 0; i < dd.length; i++) {
		var coordinates = applyLatLngToLayerf(dd[i]);
		dd[i].PIXEL_X = coordinates.x;
		dd[i].PIXEL_Y = coordinates.y;
	}
}


d3.select("#ctrlFutureMapFilterButton").on("click", function() {

	d3.select(this).html("Loading");
		
	var loadInterval = setInterval(function() {
		var elem = d3.select("#ctrlFutureMapFilterButton");
		var html = elem.html();
		if (html == "Loading...") {
			elem.html("Loading");
		}
		else {
			elem.html(html + ".");
		}
	}, 1000);

	var day = d3.select("#ctrlFutureMapDay").node();
	var dayValue = day.options[day.selectedIndex].value;
	
	var hour = d3.select("#ctrlFutureMapHour").node();
	var hourValue = hour.options[hour.selectedIndex].value;
	
	var meridiem = d3.select("#ctrlFutureMapMer").node();
	var meridiemValue = meridiem.options[meridiem.selectedIndex].value;
	
	if (hourValue == "12" && meridiemValue == "am") {
		hour = "";
	}
	else if (meridiemValue == "pm") {
		var hour = parseInt(hour) + 12;
	}
	else {
		// Do nothing.
	}
		
		
	var weather = d3.select("#ctrlFutureMapWeather").node();
	var weatherValue = weather.options[weather.selectedIndex].value;
	
	var request = {
		"target" : "ml",
		"day" : dayValue,
		"time" : hourValue + "00",
		"weather" : weatherValue
	};
		
	var callback = function() { 
		clearInterval(loadInterval); 
		d3.select("#ctrlFutureMapFilterButton").html("Filter");
	};
	
	renderf(request, callback);
});