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
	
	d3.select(this).html("Loading");
	
	homeLoadInterval = setInterval(function() {
		var button = d3.select("#visButton");
		var html = button.html();
		if (html == "Loading...") {
			button.html("Loading");
		}
		else {
			button.html(html + ".");
		}
		console.log("exe");
	}, 1000);
	
	var city = d3.select("#homeCity").attr("value");
	
	var know = getSelectedValueForClass("homeKnow");
	
	var perspective = getSelectedValueForClass("homePer");
	
	// Call navigation module
	setTimeout(function() {
		loadScreen(know, perspective, homeHide)
	}, 100);

});

function homeHide() {

	clearInterval(homeLoadInterval);

	var h = window.innerHeight;
	d3.select("#home")
		.transition()
		.duration(1000)
		.style("top", -h + "px")
		.on("end", function() {
			d3.select("#visButton").html("Visualize");
		});
		
	ctrlShow();
}

function homeShow() {	
	d3.select("#home")
		.transition()
		.duration(1000)
		.style("top","0px");
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