var homeLoadInterval;

d3.selectAll(".homeKnow").on("click", function() {
	d3.selectAll(".homeKnow").each(function() {
		d3.select(this)
			.attr("x-data-selected", "no")
			.style("text-decoration","none");
	});
	
	d3.select(this)
		.attr("x-data-selected", "yes")
		.style("text-decoration", "underline");
});

d3.selectAll(".homePer").on("click", function() {
	d3.selectAll(".homePer").each(function() {
		d3.select(this)
			.attr("x-data-selected", "no")
			.style("text-decoration","none");
	});
	
	d3.select(this)
		.attr("x-data-selected", "yes")
		.style("text-decoration", "underline");
});

d3.select("#visButton").on("click", function() {
	
	d3.select(this).style("display", "none");
	d3.select("#homeLoadingText").style("display", "block");
	
	var city = d3.select("#homeCity").attr("value");
	
	var know = getSelectedValueForClass("homeKnow");
	
	var perspective = getSelectedValueForClass("homePer");
	
	setTimeout(function() {
		loadScreen(know, perspective, hideHomeScreen)
	}, 100);

});

function hideHomeScreen() {
		clearInterval(homeLoadInterval);
		var h = window.innerHeight;
		d3.select("#home")
			.transition()
			.duration(1000)
			.style("top", -h + "px");
			
		d3.select("#ctrl")
			.style("display","block")
			.transition()
			.duration(1000)
			.delay(1000)
				.style("opacity", 1.0);
}

function getSelectedValueForClass(className) {
		var value = "";
		d3.selectAll("." + className).each(function() {
		var s = d3.select(this);
		if (s.attr("x-data-selected") == "yes") {
			value = s.attr("x-data-value");
		}
		else {
			// Keep looking.
		}
	});
	return value;
}