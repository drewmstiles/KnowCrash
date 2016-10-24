
$("#heatmap").css("top",window.innerHeight + "px");

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

$(document).on("click", ".nav", function() {
	orient($(this).attr("id"));
});

function orient(dir) {

	var anim = {};
	if (dir == "down") {
		anim.top = "-=" + window.innerHeight;
	}
	else if (dir == "left") {
		anim = anim.left = "+=" + window.innerWidth;
	}
	else if (dir == "right") {
		anim.left = "-=" + window.innerWidth;
	}
	else {
		anim.top = "+=" + window.innerHeight;
	}
	
	clean();
	
	$(".view").animate(anim, 1000, function() {
		showHeatmap();
	});	
}