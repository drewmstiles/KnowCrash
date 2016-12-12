// Based on example at https://bl.ocks.org/mbostock/3883245

var heatLineSvgHeight = window.innerHeight/2;
var heatLineSvgWidth = window.innerWidth;

var lineSvg = d3.select("#heatmap").append("svg").attr("id", "heatline").style("width", heatLineSvgWidth).style("height", heatLineSvgHeight).style("margin-top", window.innerHeight/2);
    heatLineMargin = {top: 80, right: heatLineSvgWidth - (heatMapGridSize * 24 + heatMapMargin.left), bottom: 30, left: heatMapMargin.left},
    heatLineWidth = heatLineSvgWidth - heatLineMargin.left - heatLineMargin.right,
    heatLineHeight = heatLineSvgHeight - heatLineMargin.top - heatLineMargin.bottom;
    
var lineG;

var x = d3.scaleLinear()
    .rangeRound([0, heatLineWidth]);

var y = d3.scaleLinear()
    .rangeRound([heatLineHeight, 0]);

var line = d3.line()
    .x(function(d) { return x(d.hour); })
    .y(function(d) { return y(d.value); });

function showHeatLine(callback) {
	d3.csv("lb_agg.csv",function(d) {
		d.hour = +d.hour;
		d.value = +d.value;
		return d;
		}, function(error, heatLineData) {
	  if (error) throw error;
	
		if (lineG != undefined) {
			lineG.remove();
		}
		
		lineG = lineSvg.append("g")
    		.attr("transform", "translate(" + heatLineMargin.left + "," + heatLineMargin.top + ")");
		
		
		var day = d3.select("#ctrlHeatmapDay").node();
		var dayValue = day.options[day.selectedIndex].value;
		heatLineData = heatLineData.filter(function(d) {
			return d.day == dayValue;
		});
		
		heatLineData.sort(function(x, y) {
			return d3.ascending(x.hour, y.hour);
		});

	  x.domain([1, 24]);
	  y.domain([0, d3.max(heatLineData, function(d) { return d.value; }) ]);
		
		
	lineG.append("text")
		.attr("fill", "white")
		.attr("transform", "translate(" + heatLineWidth/2 + ",-25)")
		.attr("text-anchor", "middle")
		.text("Accident Frequency Chart");
		
		
	  lineG.append("g")
		  .attr("class", "lineAxis lineAxis--x")
		  .attr("transform", "translate(0," + heatLineHeight + ")")
		  .call(d3.axisBottom(x))
		.append("text")
		  .attr("fill", "#fff")
		  .attr("transform", "translate(" + (heatLineWidth - 28)+ ",0)")
		  .attr("y", -12)
		  .attr("dy", "0.71em")
		  .text("Time of Day");

	  lineG.append("g")
		  .attr("class", "lineAxis lineAxis--y")
		  .call(d3.axisLeft(y).tickSize(-heatLineWidth))
		.append("text")
		  .attr("fill", "#fff")
		  .attr("transform", "translate(-40," + heatLineHeight/2 + ")rotate(-90)")
		  .attr("dy", "0.71em")
		  .style("text-anchor", "middle")
		  .text("Accident Count");

	  lineG.append("path")
		  .datum(heatLineData)
		  .attr("class", "line")
		  .attr("d", line);
		  
		callback();
	});
}



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
	
	showHeatLine(callback);
});