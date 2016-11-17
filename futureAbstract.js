var height = window.innerHeight;
var width = window.innerWidth - 40;

d3.csv("lb_inters.csv", function(faData) {

	faData = faData.slice(0,40);

	var barPadding = 2;
	var barWidth = (width / faData.length) - barPadding;

	var yScale = d3.scaleLinear()
		.domain([0, faData[0].COUNT])
		.range([0, height - 20]);

	var xScale = d3.scaleLinear()
		.domain([0, faData.length])
		.range([0, width]);


	var fasvg = d3.select("#futureAbstract")
		.append("svg")
		.style('width', width + 'px')
		.style('height', height + 'px')
		.style('margin-left', 20);

	fasvg.selectAll('rect')
		.data(faData)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr("x", function (d, i) {
			return xScale(i);
		})
		.attr("y", function (d, i) {
			return height;
		})
		.attr("width", function (d, i) {
			return barWidth;
		})
		.attr("fill", function (d, i) {
			return 'blue';
		})
		.attr("height", 0)
		.transition()
		.duration(250)
		.delay(function (d, i) {
			return i * 250;
		})
		.attr("y", function (d, i) {
			return height - yScale(d.COUNT);
		})
		.attr("height", function (d, i) {
			return yScale(d.COUNT);
		});
});