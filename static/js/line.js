// Based on example at https://bl.ocks.org/mbostock/3883245

var dayNumberToNameMap = {
	 "1" : "Mo",
	 "2" : "Tu",
	 "3" : "We",
	 "4" : "Th",
	 "5" : "Fr",
	 "6" : "Sa",
	 "7" : "Su" 
}

var lineSvgHeight = window.innerHeight/2;
var lineSvgWidth = window.innerWidth;

var lineSvg = d3.select("#heatmap").append("svg").attr("id", "heatline").style("width", lineSvgWidth).style("height", lineSvgHeight).style("margin-top", window.innerHeight/2);
    lineMargin = {top: 80, right: lineSvgWidth - (heatMapGridSize * 24 + heatMapMargin.left), bottom: 30, left: heatMapMargin.left},
    lineWidth = lineSvgWidth - lineMargin.left - lineMargin.right,
    lineHeight = lineSvgHeight - lineMargin.top - lineMargin.bottom;

var x = d3.scaleLinear()
    .rangeRound([0, lineWidth]);

var y = d3.scaleLinear()
    .rangeRound([lineHeight, 0]);
	
var line = d3.line()
    .x(function(d) { return x(d.hour); })
    .y(function(d) { return y(d.value); })
    .curve(d3.curveBasis);


var lineG;

function showLine(callback) {
	d3.csv("static/data/lb_agg.csv",function(d) {
			d.hour = +d.hour;
			d.value = +d.value;
			return d;
		}, function(error, lineData) {
		
		if (error) {
			throw error;
		}
		else {
			// Select global max before preprocessing.
			// This eliminates scaling bias.
			var yMax = d3.max(lineData, function(d) { return d.value; });
			x.domain([1, 24]);
			y.domain([0, Math.ceil(yMax/100) * 100 ]); // Round to nearest hundreds.
		
			// Why do I need to return modified array?
			// Javascript is pass by reference?
			lineAppend(linePreprocess(lineData));
		
			callback();
		}
	});
}

// JavaScript pass by reference but reference is value to caller.
function linePreprocess(data) {
	
	var day = d3.select("#ctrlHeatmapDay").node();
	var dayValue = day.options[day.selectedIndex].value;

// TODO implement day filters	
// 	data = data.filter(function(d) {
// 		return d.day == dayValue;
// 	});

	var dayToSamplesMap = parseDaysFromData(data);
	for (day in dayToSamplesMap) {
		var samples = dayToSamplesMap[day];
		samples.sort(function(x, y) {
			return d3.ascending(x.hour, y.hour);
		});
		dayToSamplesMap[day] = samples;
	}
	
	return dayToSamplesMap;
}

function parseDaysFromData(data) {
	var map = {};
	for (var i = 0; i < data.length; i++) {
		var sample = data[i];
		var day = dayNumberToNameMap[sample.day];
		var list = map[day];
		if (list == undefined) {
			map[day] = [sample];
		}
		else {
			map[day].push(sample);	
		}
	}
	return map;
}

function lineClean() {
	if (lineG != undefined) {
		lineG.remove();
	}
	else {
		// nada
	}
}

function lineAppend(dayToSamplesMap) {

		lineClean();

		lineG = lineSvg.append("g")
			.attr("transform", "translate(" + lineMargin.left + "," + lineMargin.top + ")");
			
		lineG.append("text")
		.attr("fill", "white")
		.attr("transform", "translate(" + lineWidth/2 + ",-25)")
		.attr("text-anchor", "middle")
		.text("Accident Frequency Chart");
		
	  lineG.append("g")
		  .attr("class", "lineAxis lineAxis--x")
		  .attr("transform", "translate(0," + lineHeight + ")")
		  .call(d3.axisBottom(x));

	  lineG.append("g")
		  .attr("class", "lineAxis lineAxis--y")
		  .call(d3.axisLeft(y));

	for (day in dayToSamplesMap) {	
		var samples = dayToSamplesMap[day];
		lineG.append("path")
			.datum(samples)
			.attr("id", "line" + day)
			.attr("class", "line")
			.attr("d", line)
			.style("stroke", lineDayToColorScale(day))
			.style("stroke-width", "3px")
			.style("opacity", 0.80);
	}
}


/*
 * Event Handlers.
 */
d3.select("#ctrlHeatmapFilterButton").on("click", function() {

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
		d3.select("#ctrlHeatmapFilterButton").html("Filter");
	};
	
	showLine(callback);
});