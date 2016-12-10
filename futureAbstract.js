var height = window.innerHeight;
var width = window.innerWidth;

var countToColorScale = d3.scaleLinear();
	
var MIN_INDEX = 25;

var fad;
var yScale;
var xScale;

function showFutureBars(callback) {
	d3.csv("lb_inters.csv", function(faData) {

		callback();
		
		faData = faData.slice(0,MIN_INDEX + 1);

		var barPadding = 2;
		var barWidth = (width / faData.length) - barPadding;

		yScale = d3.scaleLinear()
			.domain([0, faData[0].COUNT])
			.range([height/4, height - 20]);

		countToColorScale
			.domain([faData[MIN_INDEX].COUNT, faData[0].COUNT])
			.range(["blue","red"]);
		
		xScale = d3.scaleLinear()
			.domain([0, faData.length])
			.range([0, width]);


		var fasvg = d3.select("#futureAbstract")
			.append("svg")
			.style('width', width + 'px')
			.style('height', height + 'px')
			.style('background-color', "#D9D9D9")
			.style('stroke-width', 0);

		fad = fasvg.selectAll('rect')
			.data(faData)
			.enter();
		
		var rects = fad.append('rect')
			.attr('class', 'bar')
			.attr("x", function (d, i) {
				return xScale(i);
			})
			.attr("y", function (d, i) {
				return height;
			})
			.attr("width", function (d, i) {
				return barWidth;
			})
			.attr("fill", function (d) {
				return countToColorScale(d.COUNT);
			})
			.attr("height", 0)
		
		var n = 0;
		rects.transition()
			.duration(1000)
			.delay(function (d, i) {
				return i * 250 + 500;
			})
			.attr("y", function (d, i) {
				return height - yScale(d.COUNT);
			})
			.attr("height", function (d, i) {
				return yScale(d.COUNT);
		}).each(function() { ++n; })
		.on("end", function() {
			if (!--n) appendPercentageLabels();
		});
	
		fad.append("text")
			.attr("fill", "white")
			.attr("y", height - 40)
			.attr("x", function (d, i) { return xScale(i) + barWidth/2; })
			.attr("transform", function (d, i) { 
				return ("rotate(-90 " + (xScale(i) + barWidth/2) + " " + (height - 40) + ")");
			})
			.attr("font-size", "10px")
			.text(function(d) { return d.PRIMARY_RD + " & " + d.SECONDARY_RD });
		

		
	});
}


function appendPercentageLabels() {
	fad.append("text")
		.attr("fill", "white")
		.attr("y", function(d) { return height - yScale(d.COUNT) - 5; })
		.attr("x", function (d, i) { return xScale(i) + 5; })
		.attr("font-size", "10px")
		.attr("fill", function(d) { return countToColorScale(d.COUNT); })
		.text(function(d) { return Number(poisson(d.COUNT)).toFixed(3) + "%"; })
		.attr("opacity", 0)
		.transition()
		.duration(1000)
			.attr("opacity", 1.0);
}