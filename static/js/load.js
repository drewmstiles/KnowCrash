
var DEBUG = true;

var panel = d3.select("#panel");

var panelWidth = panel.node().getBoundingClientRect().width;

panel.style('left', (-1*panelWidth) + 'px');

