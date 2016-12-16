var RAINBOW_COLORS = ["#FF0000", "FF7F00", "FFFF00", "#00FF00", "#31FFFF", "#F5A3C8", "#8F00FF"];
	
var heatMapMargin = { top: 80, right: 50, bottom: 0, left: 50 },
	heatMapGridSize = Math.min(	Math.floor((window.innerWidth - heatMapMargin.left - heatMapMargin.right) / 24),
								Math.floor((window.innerHeight/2 - heatMapMargin.top - heatMapMargin.bottom) / 7)),
	legendElementWidth = heatMapGridSize * 2,
	buckets = 9,
	colors = ["black","white"],
	heatmapDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
	

	if (heatMapGridSize == Math.floor((window.innerHeight/2 - heatMapMargin.top - heatMapMargin.bottom) / 7)) {
		var excessSpace = window.innerWidth - (heatMapGridSize * 24);
		heatMapMargin.right = excessSpace / 2;
		heatMapMargin.left = excessSpace / 2;
	}



var lineDayToColorScale = d3.scaleOrdinal()
	.domain(heatmapDays)
	.range(RAINBOW_COLORS);
	
		
var root = d3.select("#heatmap")
	.attr("width", window.innerWidth)
	.attr("height", window.innerHeight / 2);
	
	
var heatSvg = root.append("svg")
	.style("position", "absolute")
	.style("top", "0")
	.attr("width", window.innerWidth)
	.attr("height", window.innerHeight/2)
	.append("g");
	
	heatSvg.append("text")
		.attr("fill", "white")
		.attr("transform", "translate(" + heatMapGridSize * 12 + ",-40)")
		.attr("text-anchor", "middle")
		.text("Accident Frequency Heatmap");
	
var dayLabels = heatSvg.selectAll(".heatmapDayLabel")
	.data(heatmapDays)
	.enter().append("text")
		.text(function (d) { return d; })
		.attr("x", 0)
		.attr("y", function(d, i) { return i * heatMapGridSize; })
		.style("text-anchor", "end")
		.style("fill", function(d) { return lineDayToColorScale(d); })
		.attr("transform", "translate(-12," + heatMapGridSize / 1.5 + ")")
		.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "heatmapDayLabel mono axis axis-workweek" : "heatmapDayLabel mono axis"); });

var timeLabels = heatSvg.selectAll(".heatmapTimeLabel")
	.data(times)
	.enter().append("text")
		.text(function(d) {return d; })
		.attr("x", function(d, i) { return i * heatMapGridSize; })
		.attr("y", 0)
		.style("text-anchor", "middle")
		.style("fill", "white")
		.attr("transform", "translate(" + heatMapGridSize / 2 + ", -12)")
		.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "heatmapTimeLabel mono axis axis-worktime" : "heatmapTimeLabel mono axis"); });
		
var cards;


function showHeatmap(callback) {
	d3.csv("lb_agg.csv", function (error, data) {
		var heatMapColorScale = d3.scaleLinear()
			.domain([d3.min(data, function(d) { return +d.value; }), d3.max(data, function (d) { return +d.value; })])
			.range(colors);
			
		cards = heatSvg.selectAll(".hour")
			.data(data, function(d) { return d.day + ":" + d.hour; });
			
		cards.append("title");
		
		cards.enter().append("rect")
			.attr("x", function(d) { return (d.hour - 1) * heatMapGridSize; })
			.attr("y", function(d) { return (d.day - 1) * heatMapGridSize; })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("class", "hour bordered")
			.attr("width", heatMapGridSize)
			.attr("height", heatMapGridSize)
			.attr("opacity", 0.0)
			.style("fill", function(d) { return heatMapColorScale(d.value); })
			.call(function() {
				callback();
				showHeatmapTiles();
			});
			
		cards.select("title").text(function(d) { return d.value; });
		
		cards.exit().remove();
		
		var legend = heatSvg.select(".legend");
			
		legend.enter().append("g")
			.attr("class", "legend");
			
		legend.append("rect")
			.attr("x", function(d, i) { return legendElementWidth * i; })
			.attr("y", window.innerHeight)
			.attr("width", legendElementWidth)
			.attr("height", heatMapGridSize / 2)
			.style("fill", function(d, i) { return colors[i]; });
			
		legend.append("text")
			.attr("class", "mono")
			.text(function (d) { return ">= " + Math.round(d); })
			.attr("x", function(d, i) { return legendElementWidth * i })
			.attr("y", window.innerHeight + heatMapGridSize);
			
		legend.exit().remove();
		

		// Position heatmap.		
		heatSvg.attr("transform","translate(" + heatMapMargin.left + "," + heatMapMargin.top + ")");
	});


}

function showHeatmapTiles() {
	d3.selectAll(".hour")
		.transition()
		.duration(1000)
		.attr("opacity", 1.0);
}

function hideHeatmapTiles() {
	d3.selectAll(".hour")
		.duration(1000)
		.style("opacity", 0.0);
}