
render(60,22);

function render(a, b){

var seedData = [{
			    "label": "",
			    "value": a,
			    "color": "rgb(224,30,59)",
			  	}, 
			  	{
			    "label": "",
			    "value": b,
			    "color": "rgb(224,140,152)",
			 	 }];

// Define size & radius of donut pie chart
var width = 250,
    height = 250,
    radius = 125;

// Define arc colours
var colour = d3.scale.category20b();

// Define arc ranges
var arcText = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1, .3);

// Determine size of arcs
var arc = d3.svg.arc()
    .innerRadius(60)
    .outerRadius(100);

// Create the donut pie chart layout
var pie = d3.layout.pie()
      		.value(function (d) { return d["value"]; })
    		.sort(null);

  // Append SVG attributes and append g to the SVG
var svg = d3.select("#donut-chart")
		    .attr("width", width)
		    .attr("height", height)
	      	.append("g")
	      	.attr("transform", "translate(" + radius + "," + radius + ")");

  // Define inner circle
  	svg.append("circle")
	    .attr("cx", 0)
	    .attr("cy", 0)
	    .attr("r", 100)
	    .attr("fill", "#fff") ;

  // Calculate SVG paths and fill in the colours
var g = svg.selectAll(".arc")
          	.data(pie(seedData))
      		.enter().append("g")
	        .attr("class", "arc")

      // Append the path to each g
  	g.append("path")
      .attr("d", arc)
      .attr("fill", function(d, i) {
          return seedData[i].color;
      })
      .transition().duration(1000)
	  .attrTween("d", function (d) { 
                var start = {startAngle: 0, endAngle: 0};
                var interpolate = d3.interpolate(start, d);
                return function (t) {
                    return arc(interpolate(t));
                };
            });


      // Append text labels to each arc
      g.append("text")
      .attr("transform", function(d) {
          return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .attr("fill", "#fff")
          .text(function(d,i) { return seedData[i].label; })
    
    g.selectAll(".arc text")
          .call(wrap, arcText.rangeBand());

      // Append text to the inner circle
      svg.append("text")
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
          .attr("fill", "#36454f")
        .text(function(d) { return 'Percentage'; });

      svg.append("text")
        .attr("dy", "1.0em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
          .attr("fill", "#36454f")
        .text(function(d) { return '0.731'; });

      // Wrap function to handle labels with longer text
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          console.log("tspan: " + tspan);
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > 90) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }

  var arr
  var xmlhttp = new XMLHttpRequest();
  var url = "http://localhost/webserver/php/winloss.php";

  xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          myFunction(xmlhttp.responseText);
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  
  function myFunction(response) {
      arr = JSON.parse(response);
  }
 

  function change(x) {
   document.getElementById("record").innerHTML = arr[x].w + " - " + arr[x].l;
    render(arr[x].w, arr[x].l);
  }