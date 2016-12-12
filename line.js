// Based on example at https://bl.ocks.org/mbostock/3883245

var heatLineSvgHeight = window.innerHeight/2;
var heatLineSvgWidth = window.innerWidth;

var lineSvg = d3.select("#heatmap").append("svg").attr("id", "heatline").style("width", heatLineSvgWidth).style("height", heatLineSvgHeight).style("margin-top", window.innerHeight/2);
    heatLineMargin = {top: 80, right: heatLineSvgWidth - (heatMapGridSize * 24 + heatMapMargin.left), bottom: 30, left: heatMapMargin.left},
    heatLineWidth = heatLineSvgWidth - heatLineMargin.left - heatLineMargin.right,
    heatLineHeight = heatLineSvgHeight - heatLineMargin.top - heatLineMargin.bottom,
    lineG = lineSvg.append("g")
    	.attr("transform", "translate(" + heatLineMargin.left + "," + heatLineMargin.top + ")");

var x = d3.scaleLinear()
    .rangeRound([0, heatLineWidth]);

var y = d3.scaleLinear()
    .rangeRound([heatLineHeight, 0]);

var line = d3.line()
    .x(function(d) { return x(d.hour); })
    .y(function(d) { return y(d.value); });

var currentDay = "1";

function showHeatLine(callback) {
	d3.csv("lb_agg.csv",function(d) {
		d.hour = +d.hour;
		d.value = +d.value;
		return d;
		}, function(error, heatLineData) {
	  if (error) throw error;
			
		heatLineData = heatLineData.filter(function(d) {
			return d.day == currentDay;
		});
		
		heatLineData.sort(function(x, y) {
			return d3.ascending(x.hour, y.hour);
		});

	  x.domain([0, 24]);
	  y.domain([0, d3.max(heatLineData, function(d) { return d.value; }) ]);
		
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
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", "0.71em")
		  .style("text-anchor", "end")
		  .text("Number of Accidents");

	  lineG.append("path")
		  .datum(heatLineData)
		  .attr("class", "line")
		  .attr("d", line);
		  
		callback();
	});
}