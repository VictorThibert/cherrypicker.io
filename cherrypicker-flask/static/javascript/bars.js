var barWidth = 100,
	barHeight = 250,
	barPadding = 20,
	colors = d3.scale.category20();

var tipA = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
        	if(d.x == 1) {
        		return "<strong>League Average: </strong><span style='color: white'>" + d.y + "</span>"}
          	else {
          		return "<strong>PPG: </strong><span style='color: white'>" + d.y + "</span>"};
        })

var tipC = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>APG: </strong><span style='color: white'>" + d + "</span>";
        })

var tipD = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>SPG: </strong><span style='color: white'>" + d + "</span>";
        })

var tipE = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>BPG: </strong><span style='color: white'>" + d + "</span>";
        }) 

var tipF = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>TOPG: </strong><span style='color: white'>" + d + "</span>";
        })

var svgA = d3.select("#container-points").append("svg")
	.attr("class", "barA")
	.attr("width", barWidth)
	.attr("height", barHeight);

var svgC = d3.select("#container-assists").append("svg")
	.attr("class", "barC")
	.attr("width", barWidth)
	.attr("height", barHeight);

var svgD = d3.select("#container-steals").append("svg")
	.attr("class", "barD")
	.attr("width", barWidth)
	.attr("height", barHeight);

var svgE = d3.select("#container-blocks").append("svg")
	.attr("class", "barE")
	.attr("width", barWidth)
	.attr("height", barHeight);

var svgF = d3.select("#container-turn").append("svg")
	.attr("class", "barF")
	.attr("width", barWidth)
	.attr("height", barHeight);

	var dataA = [
				{x:0, y:102.5},
			 	{x:1, y:100.1}
			 	],

	    dataC = [25.7,20.5],
	    dataD = [9.1,7.7],
	    dataE = [4.75,4.8],
	    dataF = [14.23,14.35],
	    dataScale = [80,120],
	    scaleCount = [0,35];

	var xScale = d3.scale.ordinal()
	            .domain(d3.range(dataA.length))
	            .rangeRoundBands([0, barWidth], 0.05);

	var yScale = d3.scale.linear()
	            .domain([d3.min(dataScale), d3.max(dataScale)])
	            .range([0, barHeight]);

	var countScale = d3.scale.linear()
	            .domain([0, d3.max(scaleCount)])
	            .range([0, barHeight]);

	var xAxis = d3.svg.axis()
      			.scale(xScale)
      			.orient("bottom");           

	    svgA.selectAll("rect")
	        .data(dataA)
	        .enter()
	        .append("rect")
	        .attr("x", function (d, i){
	            return xScale(i);
	        })
	        .attr("y", function (d){
	            return barHeight - yScale(d.y) * 1.5;
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function (d){
	            return yScale(d.y) * 1.5;
	        })
	        .attr("fill", function (d, i){
	            return colors(i);
	        })
	        .on('mouseover', tipA.show)
        	.on('mouseout', tipA.hide)

	    svgC.selectAll("rect")
	        .data(dataC)
	        .enter()
	        .append("rect")
	        .attr("x", function (d, i){
	            return xScale(i);
	        })
	        .attr("y", function (d){
	            return barHeight - countScale(d);
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function (d){
	            return countScale(d);
	        })
	        .attr("fill", function (d, i){
	            return colors(i);
	        })
	        .on('mouseover', tipC.show)
        	.on('mouseout', tipC.hide)

	        svgD.selectAll("rect")
	        .data(dataD)
	        .enter()
	        .append("rect")
	        .attr("x", function (d, i){
	            return xScale(i);
	        })
	        .attr("y", function (d){
	            return barHeight - countScale(d);
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function (d){
	            return countScale(d);
	        })
	        .attr("fill", function (d, i){
	            return colors(i);
	        })
	        .on('mouseover', tipD.show)
        	.on('mouseout', tipD.hide)

	        svgE.selectAll("rect")
	        .data(dataE)
	        .enter()
	        .append("rect")
	        .attr("x", function (d, i){
	            return xScale(i);
	        })
	        .attr("y", function (d){
	            return barHeight - countScale(d);
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function (d){
	            return countScale(d);
	        })
	        .attr("fill", function (d, i){
	            return colors(i);
	        })
	        .on('mouseover', tipE.show)
        	.on('mouseout', tipE.hide)

	        svgF.selectAll("rect")
	        .data(dataF)
	        .enter()
	        .append("rect")
	        .attr("x", function (d, i){
	            return xScale(i);
	        })
	        .attr("y", function (d){
	            return barHeight - countScale(d);
	        })
	        .attr("width", xScale.rangeBand())
	        .attr("height", function (d){
	            return countScale(d);
	        })
	        .attr("fill", function (d, i){
	            return colors(i);
	        })
	        .on('mouseover', tipF.show)
        	.on('mouseout', tipF.hide) 

			svgA.append("text")
			    .attr("class", "xLabel")
			    .attr("text-anchor", "middle")
			    .text("PPG"); 

			svgA.append("g")
				.attr("transform", "translate(0," + barHeight + ")")
			    .call(xAxis);   
  
			svgA.call(tipA);
			svgC.call(tipC);
			svgD.call(tipD);
			svgE.call(tipE);
			svgF.call(tipF);

console.log;
