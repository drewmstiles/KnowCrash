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

var PANEL_MIN_LEFT = -25;
var PANEL_MAX_LEFT = 0;
var PANEL_EXPOSURE = 5;
var CONTENT_MAX_WIDTH = 100 - PANEL_EXPOSURE;
var CONTENT_MIN_WIDTH = 100 - Math.abs(PANEL_MIN_LEFT) - PANEL_EXPOSURE;

d3.select("#panelControl").on("click", function() {
	showPanel();
});

d3.select(".panelBackArrow").on("click", function() {
	hidePanel();
});


	
function showPanel() {

	var panel = d3.select("#panel");
	
	d3.select("#panelArrow")
		.html("&nbsp;");
		
	panel
		.classed("min", false)
		.classed("max", true)
		.transition()
		.duration(1000)
		.styleTween('left', function() {
			return d3.interpolateString(PANEL_MIN_LEFT + "%", PANEL_MAX_LEFT + "%");
		});
		
	var view = d3.select(".showing");
	
	view.transition()
		.duration(1000)
		.styleTween('width', function() {
			return d3.interpolateString(CONTENT_MAX_WIDTH + '%', CONTENT_MIN_WIDTH + '%');
		})
		.styleTween('left', function() {
			return d3.interpolateString(100 - CONTENT_MAX_WIDTH + "%", 100 - CONTENT_MIN_WIDTH + "%");
		});
		
	var id = view.attr("id");
	
	d3.select('#' + id + 'Panel')
		.transition()
		.duration(750)
		.delay(250)
		.styleTween('width', function() {
			return d3.interpolateString(getElementWidthAsPercent(this), '80%');
		})
	
	d3.select("#panelControl")
		.transition()
		.duration(750)
		.delay(250)
		.styleTween('width', function() {
			return d3.interpolateString(getElementWidthAsPercent(this), '0%');
		})
}
	
	
function hidePanel() {

	var panel = d3.select("#panel");

	d3.select("#panelArrow")
		.style("opacity", 0.0)	
		.html("&#9654;")
		.transition()
		.duration(1000)
		.style("opacity", 1.0);
		
	panel
		.classed("max", false)
		.classed("min", true)
		.transition()
		.duration(750)
		.delay(250)
		.styleTween('left', function() {
			return d3.interpolateString(PANEL_MAX_LEFT + "%", PANEL_MIN_LEFT + "%");
		});
		
	var view = d3.select(".showing");
	
	view.transition()
		.duration(750)
		.delay(250)
		.styleTween('width', function() {
			return d3.interpolateString(CONTENT_MIN_WIDTH + '%', CONTENT_MAX_WIDTH + '%');
		})
		.styleTween('left', function() {
			return d3.interpolateString(100 - CONTENT_MIN_WIDTH + "%", 100 - CONTENT_MAX_WIDTH + "%");
		});
		
	var id = view.attr("id");
	
	d3.select('#' + id + 'Panel')
		.transition()
		.duration(1000)
		.styleTween('width', function() {
			return d3.interpolateString(getElementWidthAsPercent(this), '64%');
		})
	
	d3.select("#panelControl")
		.transition()
		.duration(1000)
		.styleTween('width', function() {
			return d3.interpolateString(getElementWidthAsPercent(this), '16%');
		})
}
	
	
	
function getElementWidthAsPercent(e) {
	var parentWidth = e.parentNode.getBoundingClientRect().width;
	var childWidth = e.getBoundingClientRect().width;
	var percent = 100 * (childWidth / parentWidth);
	console.log(percent);
	return percent + '%';
}