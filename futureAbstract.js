var height = window.innerHeight;
var width = window.innerWidth;

var countToColorScale = d3.scaleLinear();
	
var MIN_INDEX = 25;

var fad;
var yScale;
var xScale;

function showFutureBars(request, callback) {

	$.get("http://ec2-54-67-114-248.us-west-1.compute.amazonaws.com:8080", request, function(predictions, status) {

		var formattedPredictions = [];
		var i = 0;
		for (property in predictions) {
			formattedPredictions[i++] = {
				"INTER" : property,
				"PROB" : predictions[property]
			}
		}
		
		formattedPredictions.sort(function(x, y) {
			return d3.descending(x.PROB, y.PROB);
		});
		
		formattedPredictions.map(function(d) {
			d.INTER = d.INTER.replace("_"," ");
		});
		
		console.log(formattedPredictions);
			
		callback();
		
		formattedPredictions = formattedPredictions.slice(0,MIN_INDEX + 1);

		var barPadding = 2;
		var barWidth = (width / formattedPredictions.length) - barPadding;

		yScale = d3.scaleLinear()
			.domain([formattedPredictions[MIN_INDEX].PROB, formattedPredictions[0].PROB])
			.range([height/3, height - 20]);

		countToColorScale
			.domain([formattedPredictions[MIN_INDEX].PROB, formattedPredictions[0].PROB])
			.range(["blue","red"]);
		
		xScale = d3.scaleLinear()
			.domain([0, formattedPredictions.length])
			.range([0, width]);


		var fasvg = d3.select("#futureAbstract")
			.append("svg")
			.style('width', width + 'px')
			.style('height', height + 'px')
			.style('background-color', "#D9D9D9")
			.style('stroke-width', 0);

		fad = fasvg.selectAll('rect')
			.data(formattedPredictions)
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
				return countToColorScale(d.PROB);
			})
			.attr("height", 0)
		
		var n = 0;
		rects.transition()
			.duration(1000)
			.delay(function (d, i) {
				return i * 50;
			})
			.attr("y", function (d, i) {
				return height - yScale(d.PROB);
			})
			.attr("height", function (d, i) {
				return yScale(d.PROB);
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
			.text(function(d) { return d.INTER });
		

		
	});
}


function appendPercentageLabels() {
	fad.append("text")
		.attr("fill", "white")
		.attr("y", function(d) { return height - yScale(d.PROB) - 5; })
		.attr("x", function (d, i) { return xScale(i) + 5; })
		.attr("font-size", "10px")
		.attr("font-weight", "bolder")
		.attr("fill", function(d) { return countToColorScale(d.PROB); })
		.text(function(d) { return Number(d.PROB * 100).toFixed(1) + "%"; })
		.attr("opacity", 0)
		.transition()
		.duration(1000)
			.attr("opacity", 1.0);
}