
var DEBUG = true;

var panel = d3.select("#panel");

var panelWidth = panel.node().getBoundingClientRect().width;

panel.style('left', (-1*panelWidth) + 'px');

$("#ctrlMapYear").slider({
	range: true,
	min: 2001,
	max: 2009,
	values: [2001,  2001],
	slide: function(event, ui) {
		var lower = $("#yearLower");
		var range = $("#yearRange");
		var upper = $("#yearUpper");
		if (ui.values[0] == ui.values[1]) {
			lower.hide();
			range.hide();
			// Upper always showing
			upper.html(ui.values[0]);
		}
		else {
			lower.show().html(ui.values[0]);
			range.show();
			// Upper always showing
			upper.html(ui.values[1]);
		}
	}
});


$("#ctrlMapTime").slider({
	range: true,
	min: 0000,
	max: 2400,
	step: 100,
	values: [0000, 2400],
	slide: function(event, ui) {
		var format = d3.format("0>4");
		
		var lower = $("#timeLower");
		var range = $("#timeRange");
		var upper = $("#timeUpper");
		
		var bgn0 = format("" + ui.values[0]).substring(0,2);
		var end0 = format("" + ui.values[0]).substring(2,4);
		if (ui.values[0] == ui.values[1]) {
			lower.hide();
			range.hide();
			// Upper always showing
			upper.html(bgn0 + ":" + end0);
		}
		else {
			var bgn1 = format("" + ui.values[1]).substring(0,2);
			var end1 = format("" + ui.values[1]).substring(2,4);
			lower.show().html(bgn0 + ":" + end0);
			range.show();
			// Upper always showing
			upper.html(bgn1 + ":" + end1);
		}
	}
});
		