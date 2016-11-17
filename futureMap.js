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
			
var probToColorScale = d3.scaleLinear()
	.domain([0.01, 0.07])
	.range(["blue","red"]);

var zoomToRadiusMultiplierScale = d3.scaleLinear()
	.domain([15, 12])
	.range([MAX_RADIUS_M,MIN_RADIUS_M]);
			
function showFuture() {
	
	var fmapboxTiles = new L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token={token}', {
       			attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
       			token: 'pk.eyJ1IjoiZHJld3N0aWxlcyIsImEiOiJjaWw2YXR4eXgwMWl6dWhsdjhrZGxuMXBqIn0.4rYaU8tPJ9Mw2bniPfAKdQ'
    });

	
	fmap = L.map('futureMap', {
		minZoom: 12,
		maxZoom: 15
		})
		.addLayer(fmapboxTiles)
		.setView([33.810335, -118.135071], INIT_MAP_ZOOM);
	
	fmap.on("zoomstart", clean);
	
	fmap.on("zoomend", draw);
	
	fsvg = d3.select(fmap.getPanes().overlayPane).append("svg")
		.attr("height", window.innerHeight)
		.attr("width", window.innerWidth);
	
	var fg = fsvg.append("g").attr("class", "leaflet-zoom-hide");
	
	renderf();
};

function cleanf() {

	fsvg.selectAll("circle").remove();

}

function appendf() {

	var nodes = fsvg.selectAll("g")
		.data(fdata)
		.enter()
		.append("g")
			.attr("transform", function(d) {
				return "translate(" + d.PIXEL_X + "," + d.PIXEL_Y + ")";
		})
		nodes.append("circle")
			.style("opacity", 0.6)
			.style("fill", function(d) { return probToColorScale(d.PROB) })
			.attr("r",  20);
			
		nodes.append("text")
			.text(function(d) { return Number(d.PROB).toFixed(2); })
			.style("fill", "white")
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.attr("dy", "3px")
			.style("font-weight", "bold");
		
		// Here render to screen
}

function drawf() {

	mapCoordinatesToPixelsf(fdata);
						
	cleanf();
	
	appendf();
	
	d3.select("#year")
		.transition()
		.duration(1000)
		.style("color", "white");
}
		
function renderf() {
	d3.csv("lb_inters.csv", function(dd) {
		
		fdata = dd.slice(0,40);

		for (var i = 0; i < fdata.length; i++) {
			var count = fdata[i].COUNT;
			var lambda = count / (365 * 10);
			fdata[i].PROB = ((lambda) * (1 / Math.E));
		}
		
		drawf();
	});
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
