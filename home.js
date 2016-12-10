
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
	
	var city = d3.select("#homeCity").attr("value");
	console.log(city);
	
	var know = getSelectedValueForClass("homeKnow")
	console.log(know);
	
	var perspective = getSelectedValueForClass("homePer")
	console.log(perspective);

// 	var h = window.innerHeight;
// 	d3.select("#home")
// 		.transition()
// 		.duration(1000)
// 		.style("top", -h + "px");
});


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