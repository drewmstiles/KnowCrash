d3.select("#ctrlHome").on("click", function() {

	var elem = d3.select(this);
	ctrlSwapIcons(elem, "home");

	ctrlHide(homeShow);
	
});


function ctrlSwapIcons(elem, name) {

	var background = "";
	if (elem.style("background").includes("off")) { 		
		background = "url('img/" + name + "_on.png') no-repeat center";
	}
	else {
		background = "url('img/" + name + "_off.png') no-repeat center";
	}
	
	elem.style("background", background)
		.style("background-size", "32px 32px");
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
			d3.select(this)
				.style("display","none")
				
			callback();
		});
}