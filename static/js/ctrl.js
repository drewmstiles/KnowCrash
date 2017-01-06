d3.select("#ctrlHome").on("click", function() {

	var elem = d3.select(this);
	ctrlSwapIcons(elem, "home");

	ctrlHide(homeShow);
	
});

d3.select("#ctrlInfo").on("click", function() {
	
	var screenName = navGetCurrentScreenName();
	d3.selectAll(".ctrlBody").style("display", "none");
	d3.select("#ctrl" + screenName + "InfoBody").style("display", "block");
		
	var elem = d3.select(this);
	var state = ctrlSwapIcons(elem, "info");
		
	var headHeight = d3.select("#ctrlHead").node().getBoundingClientRect().height;
	var bodyHeight = d3.select("#ctrl" + screenName + "InfoBody").node().getBoundingClientRect().height;
	
	if (state == "on") {

		d3.selectAll(".ctrlLine")
						.transition()
						.duration(1000)
							.style("opacity", 1.0);
							
		d3.select("#ctrl")
			.transition()
			.duration(1000)
				.style("height", (headHeight + bodyHeight) + "px")
	}
	else {
		d3.selectAll(".ctrlLine")
		.transition()
		.duration(1000)
			.style("opacity", 0.0);
							
		d3.select("#ctrl")
			.transition()
			.duration(1000)
				.style("height", headHeight + "px")
	}
});

d3.select("#ctrlSett").on("click", function() {
	
	var screenName = navGetCurrentScreenName();
	d3.selectAll(".ctrlBody").style("display", "none");
	d3.select("#ctrl" + screenName + "SettBody").style("display", "block");
	
	var elem = d3.select(this);
	var state = ctrlSwapIcons(elem, "sett");
		
	var headHeight = d3.select("#ctrlHead").node().getBoundingClientRect().height;
	var bodyHeight = d3.select("#ctrl" + screenName + "SettBody").node().getBoundingClientRect().height;
	
	if (state == "on") {

		d3.selectAll(".ctrlLine")
						.transition()
						.duration(1000)
							.style("opacity", 1.0);
							
		d3.select("#ctrl")
			.transition()
			.duration(1000)
				.style("height", (headHeight + bodyHeight) + "px")
	}
	else {
		d3.selectAll(".ctrlLine")
		.transition()
		.duration(1000)
			.style("opacity", 0.0);
							
		d3.select("#ctrl")
			.transition()
			.duration(1000)
				.style("height", headHeight + "px")
	}
});

function ctrlSwapIcons(elem, name) {

	var state = "";
	
	var background = "";
	if (elem.style("background").includes("off")) { 		
		background = "url('static/img/" + name + "_on.png') no-repeat center";
		state = "on";
	}
	else {
		background = "urls('static/img/" + name + "_off.png') no-repeat center";
		state = "off";
	}
	
	elem.style("background", background)
		.style("background-size", "32px 32px");
	
	return state;
}

function ctrlShow() {
	d3.select("#ctrl")
	.style("display","block")
	.transition()
	.duration(1000)
	.delay(1000)
		.style("opacity", 1.0);
}

function ctrlHide(callback) {
	d3.select("#ctrl")
	.transition()
	.duration(1000)
		.style("opacity", 0.0)
		.on("end", function() {
		
			d3.select("#ctrlHome")
				.style("background", "url('img/home_off.png') no-repeat center")
				.style("background-size", "32px 32px");
				
			d3.select(this)
				.style("display","none")
				
			callback();
		});
}

		
	
/* pANEL */

var PANEL_MIN_WIDTH = 5;
var PANEL_MAX_WIDTH = 25;
d3.select("#panel").on("click", function() {

	var isMin;
	var isMax;
	var panelStartWidth;
	var panelEndWidth;
	
	if (d3.select(this).classed("min")) {
		isMin = false;
		isMax = true;
		panelStartWidth = PANEL_MIN_WIDTH;
		panelEndWidth = PANEL_MAX_WIDTH;
	}
	else {
		isMin = true;
		isMax = false;
		panelStartWidth = PANEL_MAX_WIDTH;
		panelEndWidth = PANEL_MIN_WIDTH;
	}
	
	d3.select(this)
		.classed("min", isMin)
		.classed("max", isMax)
		.transition()
		.duration(1000)
		.styleTween('width', function() {
			return d3.interpolateString(panelStartWidth + "%", panelEndWidth + "%");
		});
	
	d3.select(".showing")
		.transition()
		.duration(1000)
		.styleTween('width', function() {
			return d3.interpolateString((100 - panelStartWidth) + '%', (100 - panelEndWidth) + '%');
		})
		.styleTween('left', function() {
			return d3.interpolateString(panelStartWidth + "%", panelEndWidth + "%");
		});
});

	
	
	
	
	
	
	