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
	var h = window.innerHeight;
	d3.select("#home")
		.transition()
		.duration(1000)
		.style("top", -h + "px");
});