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

var PANEL_MIN_LEFT = -30;
var PANEL_MAX_LEFT = 0;
var CONTENT_MAX_WIDTH = 100;
var CONTENT_MIN_WIDTH = 100 - Math.abs(PANEL_MIN_LEFT);

d3.select("#panelSwitch").on("click", function() {
	showPanel();
});

d3.select(".panelBackArrow").on("click", function() {
	hidePanel();
});


	
function showPanel() {

	var panel = d3.select("#panel");
		
	panel
		.classed("min", false)
		.classed("max", true)
		.transition()
		.duration(1000)
		.style('left', '0px');
		
	var view = d3.select(".showing");
	
	var panelWidth = panel.node().getBoundingClientRect().width;
	var viewWidth = window.innerWidth - panelWidth;
	view.transition()
		.duration(1000)
		.style('width', viewWidth + 'px')
		.style('left', panelWidth + 'px');
		
	var targetPanelBodyId = view.attr("id") + 'Panel';
	
	d3.selectAll('.panelBody')
		.each(function() {
			var panelBody = d3.select(this);
			if (panelBody.attr('id') == targetPanelBodyId) {
				panelBody.style('display', 'block');
			}
			else {
				panelBody.style('display', 'none');
			}
		});
	
	d3.select("#panelSwitch")
		.transition()
		.duration(500)
		.style("opacity", 0.0)
		.on('end', function() {
			d3.select(this).style('display', 'none');
		});
}
	
	
function hidePanel() {

	var panel = d3.select("#panel");
		
	var panelWidth = panel.node().getBoundingClientRect().width;
	var viewWidth = window.innerWidth;
	panel
		.classed("max", false)
		.classed("min", true)
		.transition()
		.duration(1000)
		.style('left', (-1 * panelWidth) + 'px');
		
	var view = d3.select(".showing");
	
	view.transition()
		.duration(1000)
		.style('width', viewWidth + 'px')
		.style('left', '0px')
		.on('end', function() {
			d3.selectAll('.panelBody')
				.style('display', 'none');
		});
		
	d3.select("#panelSwitch")
		.style('display', 'block')
		.transition()
		.delay(750)
		.duration(500)
		.style("opacity", 1.0);
}
	

function getElementWidthAsPercent(e) {
	var parentWidth = e.parentNode.getBoundingClientRect().width;
	var childWidth = e.getBoundingClientRect().width;
	var percent = 100 * (childWidth / parentWidth);
	console.log(percent);
	return percent + '%';
}


$("#ctrlMapYear").slider({
	range: true,
	min: 2001,
	max: 2009,
	values: [2001,  2001],
	slide: function(event, ui) {
		var lower = $("#yearLower");
		var range = $("#yearRange");
		var upper = $("#yearUpper");
		if (ui.values[0] == ui.values[1]) {
			lower.hide();
			range.hide();
			// Upper always showing
			upper.html(ui.values[0]);
		}
		else {
			lower.show().html(ui.values[0]);
			range.show();
			// Upper always showing
			upper.html(ui.values[1]);
		}
	}
});


$("#ctrlMapTime").slider({
	range: true,
	min: 0000,
	max: 2400,
	step: 100,
	values: [0000, 2400],
	slide: function(event, ui) {
		
		var timeRange = getTimeRange();
		
		var lower = $("#timeLower");
		var range = $("#timeRange");
		var upper = $("#timeUpper");
		
		if (timeRange[0] == timeRange[1]) {
			lower.hide();
			range.hide();
			upper.html(timeRange[0] + ":00");
		}
		else {
			lower.show().html(timeRange[0] + ":00");
			range.show();
			upper.html(timeRange[1] + ":00");
		}
	}
});
		

function getTimeRange() {

	var format = d3.format("0>4");
	
	var values = $("#ctrlMapTime").slider('option', 'values');

	var formattedValues = [];
	formattedValues[0] = format("" + values[0]).substring(0,2);
	formattedValues[1] = format("" + values[1]).substring(0,2);
	
	return formattedValues;
}
			
			
			
			