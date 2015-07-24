function localshotchart(){

			var arr2 = []; //FOR LEAGUE AVERAGES
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
			var hpoints;
			function tempReassign(){
				for (var i = 0; i < arr.length; i++) { //arr3 contains alls the shots
					arr3.push([parseInt(arr[i]["LOC_X"]) + 250, parseInt(arr[i]["LOC_Y"]) + 50, parseInt(arr[i]["SHOT_MADE_FLAG"]), arr[i]["SHOT_DISTANCE"]]);
				}
				hpoints = hexbin(arr3);
				unSmoothedHexpoints = hexbin(arr3);

				for(x in hpoints){
					var tempTotalShot = hpoints[x].totalShot;
					var tempTotalMade = hpoints[x].totalMade;
					hpoints[x].totalShot = 0.000001;
					hpoints[x].totalMade = 0;

					for(y in hpoints){
						if(hpoints[x].i == hpoints[y].i && hpoints[x].j == hpoints[y].j){
							hpoints[x].totalMade += tempTotalMade * 0.6;
							hpoints[x].totalShot += tempTotalShot * 0.6;
						}else if(Math.pow((hpoints[x].i - hpoints[y].i ), 2) + Math.pow((hpoints[x].j - hpoints[y].j ), 2) < 4 ){ //30% radius
							hpoints[x].totalMade += hpoints[y].totalMade * 0.3;
							hpoints[x].totalShot += hpoints[y].totalShot * 0.3;
						}else if(Math.pow((hpoints[x].i - hpoints[y].i ), 2) + Math.pow((hpoints[x].j - hpoints[y].j ), 2) < 6){ //10% radius
							hpoints[x].totalMade += hpoints[y].totalMade * 0.1;
							hpoints[x].totalShot += hpoints[y].totalShot * 0.1;
						}
					}
			
			}

				
				setTimeout(render, 50);

			}





				var customRadius = 5;

				var margin = {top: 0, right: 10, bottom: 10, left: 10}, //MARGIN
				    width = 550 - margin.left - margin.right,
				    height = 350 - margin.top - margin.bottom; 


				var hexbin = d3.hexbin() //INITIALIZE HEXBIN
				    .size([width, height])
				    .radius(customRadius);	




				var lastPosition = [[0, 0],[0,0]];
				var brushConditions = [1, lastPosition, 0];

				var bottomPCT = 0;
				var topPCT = 1;


				var slider = document.getElementById("sub-container-shot1");

					noUiSlider.create(slider, {
						start: [0.0, 1.0],
						step: 0.01,
						connect: true,
						range: {
							'min': 0,
							'max': 1
						}
					});

				slider.noUiSlider.on('slide', function(){
					var sliderCoordinates = slider.noUiSlider.get();
					bottomPCT = sliderCoordinates[0];
					topPCT = sliderCoordinates[1];
					d3.selectAll("svg").remove();
					render();
				})


				//SHOT ATTEMPT SLIDER  //MAKE LOGARITHMIC IF NECESSARY
				var sliderShotAttempts =  document.getElementById("sub-container-shot2");
					noUiSlider.create(sliderShotAttempts, {
							start: [0.0, 10000.0],
							step: 1,
							connect: true,
							range: {
								'min': 0,
								'max': 10000
							}
						});

				var bottomAttempts = 0;
				var topAttempts = 10000;

				sliderShotAttempts.noUiSlider.on('slide', function(){
					var sliderCoordinates2 = sliderShotAttempts.noUiSlider.get();
					bottomAttempts = sliderCoordinates2[0];
					topAttempts = sliderCoordinates2[1];
					if (topAttempts == 20){topAttempts = 100;};
					d3.selectAll("svg").remove();
					render();
				})

				//SHOT DISTANCE SLIDER
				var sliderShotDistance =  document.getElementById("sub-container-shot3");
					noUiSlider.create(sliderShotDistance, {
							start: [0.0, 20.0],
							step: 1,
							behaviour: "drag-tap",

							connect: true,
							range: {
								'min': 0,
								'max': 25
							}
						});

				var bottomDistance = 0;
				var topDistance = 25;

				sliderShotDistance.noUiSlider.on('slide', function(){
					var sliderCoordinates3 = sliderShotDistance.noUiSlider.get();
					bottomDistance = sliderCoordinates3[0];
					topDistance = parseInt(sliderCoordinates3[1]);
					
					d3.selectAll("svg").remove();
					render();
				})



				
	


			function render(){


				var radiusScale = d3.scale.pow().exponent(0.8)  //RADIUS SCALE QUANTIZE
				    .domain([0,0,1,2,50])
				    .range([0,0.5,3,5.1,5.1]); 

				var colorScale = d3.scale.linear() //GENERATE COLOUR SCALE
				    .domain([-0.4, 0.4]) //change range for +- above average
				    .range(["blue",  "red"]); //Interpolating function for colours

				var x = d3.scale.identity() //AXIS STUFF
				    .domain([0, width]); 
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


				var hexagon = svg.append("g") //ADDING THE HEXAGONS
				    //.attr("clip-path", "url(#clip)") //Does nothing ?
				  .selectAll(".hexagon")
				    .data(hpoints) //hpoints means smoothed
				 	.enter()
				  	.append("path")
				    .attr("class", "hexagon")
				    .attr("val", function(d) {return d.totalMade/d.totalShot;})
				   // .attr("d", hexbin.hexagon())
				    .attr("d", function(d) { 
				    
				    	if (d.totalMade/d.totalShot >= bottomPCT && d.totalMade/d.totalShot <= topPCT && 
				    		d.totalShot >= bottomAttempts && d.totalShot <= topAttempts &&
				    		d.distance >= bottomDistance && d.distance <= topDistance) 
				    	{
				    	 //CHECK IF BETWEEN SLIDER VALUES
				    		return hexbin.hexagon(radiusScale(d.length), 0)["dpoints"];
				    	} else {
				    	    return hexbin.hexagon(0,0)["dpoints"]; //RETURN NOTHING
				    	    };})  //d data element is the data contained in hexagon (hexbin) [ [x,y,made], [x,y,made] ]  //ACCESS HERE
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
				 //    .append("title")
				 //    .text(function(d) { 
				 //    	var percentage = 0.0;
				 //    	percentage = arr4[(Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0))][2];
				 //        return d.totalMade / d.totalShot + "\n" + percentage + "\n" + (d.totalMade / d.totalShot - percentage);
				 //    });


		
					brushing(brushConditions);

					function brushing(conditions) {




						var selectedNothing = conditions[0]; //1 0 FLAG FOR SELECTED NOTHING
					 	var extent = conditions[1]; //LAST POSITION
					 	var lastPercentage = conditions[2];
					 	var selectedPercentage = lastPercentage;

					 	d3.selectAll(".pBox").remove();
//--------------
					 	var brushInfo = d3.select('body')
		                    .append('p')
		                    .attr("class", "pBox")
		                    .html('<b>Selected %:</b> ' + selectedPercentage);

		                    var dare = d3.svg.brush()

						        .x(d3.scale.identity().domain([0, width]))
						        .y(d3.scale.identity().domain([0, height]))
						        .on("brushend", function() {
						        
							        	if (selectedNothing) {
							        		hexagon.classed("selected", true);
							        	}
							        }
							    )
						        .on("brush",  function() {       
						        		var t = [];
						        		
						        		var selectedMade = 0;
						        		var selectedTotal = 0;

										extent = d3.event.target.extent();
										lastPosition = extent;
										brushConditions[1] = lastPosition; 

										if(extent[0][0] != extent[1][0] || extent[0][1] != extent[1][1]){ //SELECTED SOMETHING
											selectedNothing = 0;
											brushConditions[0] = selectedNothing;
										} else { //SELECTED SOMETHING
											selectedNothing = 1;
											brushConditions[0] = selectedNothing;
										}
													
										hexagon.classed("selected", function(d) {


											if(extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1] &&
												d3.select(this).attr("d") != "m0,0l0,0l0,0l0,0l0,0l0,0l0,0z") {//very important structure
												selectedMade += d.totalMade;
											
												selectedTotal += d.totalShot;
											};
											return extent[0][0] <= d.x && d.x < extent[1][0]
											    && extent[0][1] <= d.y && d.y < extent[1][1];
										});

										selectedPercentage = selectedMade/selectedTotal;
										brushConditions[2] = selectedPercentage;

										brushInfo.html('<b>Selected %:</b> ' + selectedPercentage);
							        }) .extent(extent);
		
					    var brush = svg.append("g")
					      .attr("class", "brush")
					      .call(
					      	dare

						        )					       
						        
					        
					      ; //endcall
brush.call(dare.event)
						
							


 							if(1){hexagon.classed("selected", function(d) { 
 								if(selectedNothing){
 									return true;
 								}else{
 									return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1];}
					          });}
 					}
			}
		}
		localshotchart();