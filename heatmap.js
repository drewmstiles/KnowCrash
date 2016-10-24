
var margin = { top: 0, right: 50, bottom: 100, left: 50 },
	gridSize = Math.floor((window.innerWidth - margin.left - margin.right) / 24),
	legendElementWidth = gridSize * 2,
	buckets = 9,
	colors = ["yellow","red"],
	days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
	
	
var root = d3.select("#heatmap")
	.attr("width", window.innerWidth)
	.attr("height", window.innerHeight);
	
	
var svg = root.append("svg")
	.style("position", "absolute")
	.style("top", "0")
	.attr("width", window.innerWidth)
	.attr("height", window.innerHeight)
	.append("g");
	
var dayLabels = svg.selectAll(".dayLabel")
	.data(days)
	.enter().append("text")
		.text(function (d) { return d; })
		.attr("x", 0)
		.attr("y", function(d, i) { return i * gridSize; })
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
	.data(times)
	.enter().append("text")
		.text(function(d) {return d; })
		.attr("x", function(d, i) { return i * gridSize; })
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
		
var cards;
		
d3.csv("lb_agg.csv", function (error, data) {
		var colorScale = d3.scaleLinear()
			.domain([d3.min(data, function(d) { return +d.value; }), d3.max(data, function (d) { return +d.value; })])
			.range(colors);
			
		cards = svg.selectAll(".hour")
			.data(data, function(d) { return d.day + ":" + d.hour; });
			
		cards.append("title");
		
		cards.enter().append("rect")
			.attr("x", function(d) { return (d.hour - 1) * gridSize; })
			.attr("y", function(d) { return (d.day - 1) * gridSize; })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "hour bordered")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.attr("opacity", 0.0)
			.transition()
				.duration(1000)
				.style("fill", function(d) { return colorScale(d.value); });
			
		cards.select("title").text(function(d) { return d.value; });
		
		cards.exit().remove();
		
		var legend = svg.select(".legend");
// 					.data([0].concat(colorScale.quantiles()), function (d) { return d; });
			
		legend.enter().append("g")
			.attr("class", "legend");
			
		legend.append("rect")
			.attr("x", function(d, i) { return legendElementWidth * i; })
			.attr("y", height)
			.attr("width", legendElementWidth)
			.attr("height", gridSize / 2)
			.style("fill", function(d, i) { return colors[i]; });
			
		legend.append("text")
			.attr("class", "mono")
			.text(function (d) { return ">= " + Math.round(d); })
			.attr("x", function(d, i) { return legendElementWidth * i })
			.attr("y", height + gridSize);
			
		legend.exit().remove();
		

		// Position heatmap.		
		margin.top = (height/2 - svg.node().getBBox().height/2);
		svg.attr("transform","translate(" + margin.left + "," + margin.top + ")");
});


function showHeatmap() {
	d3.selectAll(".hour")
		.transition()
		.duration(1000)
		.style("opacity", 1.0);
}

function hideHeatmap() {
	d3.selectAll(".hour")
		.duration(1000)
		.style("opacity", 0.0);
}