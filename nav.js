
var row = 0,
	col = 0;
	
var navMap = [
	[0,0],
	[0,0]
];

$("#wrapper").css("width",window.innerWidth + "px");
$("#wrapper").css("height",window.innerHeight + "px");

$("#heatmap").css("top",window.innerHeight + "px");
$("#futureMap").css("left",window.innerWidth + "px");

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
	orient($(this).attr("id"), this);
});

function orient(dir, elem) {

	if ($(elem).hasClass("disabled")) {
		// Do nothing.
	}
	else {
		var fn;
		var anim = {};
		
		console.log("row: " + row + " col " + col);
		if (dir == "down" && (row + 1) < navMap.length) {
			row += 1;
			anim.top = "-=" + window.innerHeight;
		}
		else if (dir == "left" && (col - 1) >= 0) {
			col -= 1;
			anim.left = "+=" + window.innerWidth;
		}
		else if (dir == "right" && (col + 1) < navMap[0].length) {
			col += 1;
			anim.left = "-=" + window.innerWidth;
		}
		else if (dir == "up" && (row - 1)  >= 0) {
			row -= 1;
			anim.top = "+=" + window.innerHeight;
		}
		else {
			console.log("Where are you going?");
		}
	
		$(".view").animate(anim, 1000);
		
		setTimeout(function() {
			console.log("comp");
			if (row == 0 && col == 0) {
				
			}
			else if (row == 0 && col == 1) {
				
			}
			else if (row == 1 && col == 0) {
				showHeatmap();
			}
		}, 1010);
	}
}