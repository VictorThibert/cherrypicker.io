var w = 100;
var h = 250;

var dataset = [
	[
		{ x: 0, y: 31.8 },
		{ x: 0, y: 32.4 },
	],
	[
		{ x: 1, y: 8.7 },
		{ x: 1, y: 10.9 },

	]
];

var stack = d3.layout.stack();

stack(dataset);

var xScale = d3.scale.ordinal()
	.domain(d3.range(dataset[0].length))
	.rangeRoundBands([0, w], 0.05);

var yScale = d3.scale.linear()
	.domain([0,	d3.max(dataset, function(d) {
			return d3.max(d, function(d) {
				return d.y0 + d.y + (120 - d.y0 - d.y);
			});
		})
	])
	.range([0, h]);
	
var colors = d3.scale.category20();
var r = colors.range();

var s = d3.scale.ordinal().range(r);
colors.domain();
s.domain();
colors(0);
colors(1);
colors.domain();
s(0);
s(1);
s.domain();

d3.scale.category20()(1);

var tipB = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
        	if (d.x == 1) {
        		return "<strong>ORPG: </strong><span style='color: white'>" + d.y + "</span>"}
        	else {
        		return "<strong>DRPG: </strong><span style='color: white'>" + d.y + "</span>"};
        })

var svgB = d3.select("#container-rebounds")
			.append("svg")
			.attr("class", "barB")
			.attr("width", w)
			.attr("height", h);

var groups = svgB.selectAll("g")
	.data(dataset)
	.enter()
	.append("g")
	.style("fill", function(d, i) {
		return colors(i);
	});

var rects = groups.selectAll("rect")
	.data(function(d) { return d; })
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		return xScale(i);
	})
	.attr("y", function(d) {
		return h - yScale(d.y0) - yScale(d.y);
	})
	.attr("height", function(d) { 
		return yScale(d.y);
	})
	.attr("width", xScale.rangeBand())
	.on('mouseover', tipB.show)
	.on('mouseout', tipB.hide);

svgB.call(tipB);