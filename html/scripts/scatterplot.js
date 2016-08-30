function renderScatterplot(teamID) {
	d3.select("#scatterplotID").selectAll("svg").remove();

	var data = [];
	var xml = new XMLHttpRequest();
	var url = "http://cherrypicker.io/php/getteamdata.php"
	
	xml.onreadystatechange = function() {
		if (xml.readyState == 4 && xml.status == 200) {
			var jobj = JSON.parse(xml.responseText)
			for (var i = 0; i < jobj.length; i+=1) {
				data.push([ jobj[i].TEAM_NAME, parseFloat(jobj[i].OFF_RATING), parseFloat(jobj[i].DEF_RATING), parseInt(jobj[i].TEAM_ID) ]);
			} 	
			renderScatterplotInner(data, teamID);
		}
	}
	xml.open("GET", url, true);
	xml.send();
	
}

function renderScatterplotInner(data, teamID) {

		var margin = {top: 40, right: 20, bottom: 40, left: 60},
    width = 1040 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


	var colorScale = d3.scale.linear().domain([-10.0,10.0]).range(["red", "blue"]);

	var tValue = function(d) { return d[0];}
	
	var xValue = function(d) { return d[2];}, // data -> value
			xScale = d3.scale.linear().range([width, 0]), // value -> display
			xMap = function(d) { return xScale(xValue(d));}, // data -> display
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");


// setup y
	var yValue = function(d) { return d[1];}, // data -> value
			yScale = d3.scale.linear().range([height, 0]), // value -> display
			yMap = function(d) { return yScale(yValue(d));}, // data -> display
			yAxis = d3.svg.axis().scale(yScale).orient("left");

	// add the graph canvas to the body of the webpage
	var svg = d3.select("#scatterplotID").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("DEF_RATING");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("OFF_RATING");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {
				if(d[3] != teamID){
					return 4;
				} else {
					return 6;
				}
			})
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d){
				if(d[3] != teamID){
					return colorScale(d[1] - d[2]);
				} else {
					return "orange";
				}
				
			}) 
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
          tooltip.html(tValue(d) + "<br/> (" + xValue(d) + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });


}
