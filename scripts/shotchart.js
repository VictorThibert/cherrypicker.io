var arr2 = [];
			var arr4 = [];
			var xmlhttp2 = new XMLHttpRequest();
			var url = "http://cherrypicker.io/php/playershotsleague.php?";
			xmlhttp2.onreadystatechange=function() {
			    if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
			        myFunction2(xmlhttp2.responseText);
			    }}
			xmlhttp2.open("GET", url, true);
			xmlhttp2.send();

			function myFunction2(response) {
			    arr2 = JSON.parse(response); 
			    tempReassign2();
			}

			function tempReassign2(){
				for (var i = 0; i < arr2.length; i++) {
					arr4.push([parseInt(arr2[i]["LOC_X"]) + 250, parseInt(arr2[i]["LOC_Y"]) + 50,  arr2[i]["PERCENTAGE"] ] );	
				} //ADD TAKEN AND MADE!!!--------------
			}

			var arr = [];
			var arr3 = [];
			var xmlhttp = new XMLHttpRequest();
			var url = "http://cherrypicker.io/php/playershots.php?playerID=200794"; //(AL HORFORD: 201143) (PAUL MILLSAP: 200794)
			xmlhttp.onreadystatechange=function() {
			    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			        myFunction(xmlhttp.responseText);
			    }}
			xmlhttp.open("GET", url, true);
			xmlhttp.send();

			function myFunction(response) {
			    arr = JSON.parse(response); 
			    tempReassign();
			}
			
			function tempReassign(){
				for (var i = 0; i < arr.length; i++) {
					arr3.push([parseInt(arr[i]["LOC_X"]) + 250, parseInt(arr[i]["LOC_Y"]) + 50, parseInt(arr[i]["SHOT_MADE_FLAG"])]);
				}
				//render(); ADD DELAY
				setTimeout(render, 50);

			}
			function render(){

				var customRadius = 5;

				var margin = {top: 0, right: 10, bottom: 10, left: 10}, //MARGIN
				    width = 550 - margin.left - margin.right,
				    height = 350 - margin.top - margin.bottom; 

				var radiusScale = d3.scale.pow().exponent(0.8)  //RADIUS SCALE QUANTIZE
				    .domain([0,0,2,100])
				    .range([0,0.5,3,5.3]); 

				var points = arr3;

				var colorScale = d3.scale.linear() //GENERATE COLOUR SCALE
				    .domain([-0.09, 0.09])
				    .range(["purple",  "red"])
				    .interpolate(d3.interpolateLab); //Interpolating function for colours

				var x = d3.scale.identity() //AXIS STUFF
				    .domain([0, width])
				    ; 
				var y = d3.scale.linear()
				    .domain([0, height])
				    .range([height, 0]);
				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom")
				    .tickSize(6, -height);
				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left")
				    .tickSize(6, -width);

				var hexbin = d3.hexbin()
				    .size([width, height])
				    .radius(customRadius);		


				var svg = d3.select("#sub-container-shot").append("svg") //FIRST SVG CANVAS
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				svg.append("clipPath")//ADD CLIPATH TO GRAPH AREA
				    .attr("id", "clip")
				  .append("rect")
				    .attr("class", "mesh")
				    .attr("width", width)
				    .attr("height", height);
				svg.append("g") //ADDING THE HEXAGONS
				    .attr("clip-path", "url(#clip)") //Does nothing ?
				  .selectAll(".hexagon")
				    .data(hexbin(points))
				 	.enter()
				  	.append("path")
				    .attr("class", "hexagon")
				   // .attr("d", hexbin.hexagon())
				    .attr("d", function(d) { 
					    return hexbin.hexagon(radiusScale(d.length), 0)["dpoints"];})  //d data element is the data contained in hexagon (hexbin) [ [x,y,made], [x,y,made] ]  //ACCESS HERE
				    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				    .on("mouseover", function(d) {
				       d3.select(this)
         				 .style("fill", "orange");
				    })
				    .on("mouseout", function(d) {
				      d3.select(this)
				      	.transition()
     					.duration(250)
				     	.style("fill", function(d) {return colorScale(d.totalMade/d.totalShot - arr4[(Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0))][2]); });
					})
				    .style("fill", function(d) {return colorScale(d.totalMade/d.totalShot- arr4[(Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0))][2]); })
				    .append("title")
				    .text(function(d) { 
				    	var percentage = 0.0;

				    	percentage = arr4[(Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0))][2];
				    	
				        return d.totalMade / d.totalShot + "\n" + percentage + "\n" + (d.totalMade / d.totalShot - percentage);
				    });
			}