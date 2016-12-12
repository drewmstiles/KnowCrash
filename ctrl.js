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
		background = "url('img/" + name + "_on.png') no-repeat center";
		state = "on";
	}
	else {
		background = "url('img/" + name + "_off.png') no-repeat center";
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

		
	
	
	
	
	
	
	
	
	