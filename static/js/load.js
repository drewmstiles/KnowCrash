
var DEBUG = true;

var panelWidth = d3.select("#panel").node().getBoundingClientRect().width;
console.log(panelWidth);
if (panelWidth < 300) {
	d3.selectAll(".ctrlMapLegendEntry")
		.style("display", 'block')
		.style('margin', 'auto');
}