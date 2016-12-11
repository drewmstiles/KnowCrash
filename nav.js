$("#wrapper").css("width",window.innerWidth + "px");
$("#wrapper").css("height",window.innerHeight + "px");

$(document).on("click", "#lastYear", function() {
	var yr = $("#year");
	yr.css("color", "gray");
	yr.html(parseInt(yr.html()) - 1);
	setTimeout(render, 100);
})

$(document).on("click", "#nextYear", function() {
	var yr = $("#year");
	yr.css("color", "gray");
	yr.html(parseInt(yr.html()) + 1);
	setTimeout(render, 100);
})

$(document).on("change", "#sev", render)

$(document).on("change", "#fac", render);


// ==========================================


var screens = [
	[ "map", "heatmap" ],
	[ "futureMap", "futureAbstract" ]
];

function loadScreen(know, perspective, endFunction) {
	var screenId = "#" + screens[know][perspective];

	d3.selectAll(".screen")
		.style("display", "none");
		
	d3.select(screenId).style("display","block");
	
	if (know == 0 && perspective == 0) {
		showHistoricalMap(endFunction, 2001);
	}
	else if (know == 0 && perspective == 1) {
		showHeatmap(endFunction);
	}
	else if (know == 1 && perspective == 0) {
		showFuture(endFunction);
	}
	else {
		showFutureBars(endFunction);
	}
}
	
function navGetCurrentScreenName() {
	
	var name = "";
	
	d3.selectAll(".screen")
		.each(function() {
			var screen = d3.select(this);
			if (screen.style("display") == "block") {
				name = screen.attr("id");
			}
			else {
				// Keep looking.
			}
		});
		
	return name[0].toUpperCase() + name.substring(1);
}
	