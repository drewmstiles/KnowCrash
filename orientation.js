var width = $(window).width();
var height = $(window).height();

$("#heatmap").css("top",height + "px");

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

$(document).on("click", "#or", orientDown);

function orientDown() {
	
	clean();
	
	$(".view").delay(1000).animate({
		top: "-=" + height,
	}, 1000, function() {
		console.log("end animation");
	});	
}