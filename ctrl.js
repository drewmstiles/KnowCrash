d3.select("#ctrlHome").on("click", function() {

	var elem = d3.select(this);
	ctrlSwapIcons(elem, "home");

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