function localshotchart(count){
			//////////////////
			//LEAGUE AVERAGE
			//////////////////
			var jsonLeague = [];
			var leagueShotArray = [];
	
			var xmlLeagueRequest = new XMLHttpRequest();
			var urlLeague = "http://cherrypicker.io/php/playershotsleague.php?";
	
			xmlLeagueRequest.onreadystatechange=function() {
			    if (xmlLeagueRequest.readyState == 4 && xmlLeagueRequest.status == 200) {
			        reassignLeague(xmlLeagueRequest.responseText);
			    }
			}
			xmlLeagueRequest.open("GET", urlLeague, true);
			xmlLeagueRequest.send();

			function reassignLeague(response) {
			    jsonLeague = JSON.parse(response); 
			
			    for (var i = 0; i < jsonLeague.length; i+=1) {
						leagueShotArray.push([parseInt(jsonLeague[i].LOC_X) + 250, parseInt(jsonLeague[i].LOC_Y) + 50,  jsonLeague[i].PERCENTAGE ]);
					} 
			}
	
			//////////////////
			//SPECIFIC PLAYERS
			//////////////////
			var jsonPlayer = [];
			var playerShotArray = [];
			var xmlPlayerRequest = new XMLHttpRequest();
			var urlPlayer = "http://cherrypicker.io/php/playershots.php?playerID=" + selectedPlayers.join("$"); //(AL HORFORD: 201143) (PAUL MILLSAP: 200794)
	
			xmlPlayerRequest.onreadystatechange=function() {
			    if (xmlPlayerRequest.readyState == 4 && xmlPlayerRequest.status == 200) {
			        reassignPlayer(xmlPlayerRequest.responseText);
			    }}
			xmlPlayerRequest.open("GET", urlPlayer, true);
			xmlPlayerRequest.send();
		
			var hpoints;
			var unSmoothedHexpoints;
			var customRadius = 5;

			var margin = {top: -15, right: 20, bottom: 45, left: 20}, //MARGIN
				  width = 550 - margin.left - margin.right,
				  height = 350 - margin.top - margin.bottom; 
	
			var hexbin = d3.hexbin().size([width, height]).radius(customRadius);//Initialize Hexbin Plugin
	
			function reassignPlayer(response){
				jsonPlayer = JSON.parse(response); 
				for (var i = 0; i < jsonPlayer.length; i+=1) { //playerShotArray contains all the shots
					playerShotArray.push([parseInt(jsonPlayer[i].LOC_X) + 250, parseInt(jsonPlayer[i].LOC_Y) + 50, parseInt(jsonPlayer[i].SHOT_MADE_FLAG), jsonPlayer[i].SHOT_DISTANCE]);
				} //SHIFT BY 250 IN X AND 50 IN Y
				
				hpoints = hexbin(playerShotArray);
				unSmoothedHexpoints = hexbin(playerShotArray);
/*
 				for(var x in hpoints){ //For each point in the array
 					console.log(hpoints[x])//~0-427 bins in hpoints
 					var tempTotalShot = hpoints[x].totalShot;
 					var tempTotalMade = hpoints[x].totalMade;
 					//SMOOTH EVERYTHING HERE
 					//HERE IS WHERE THE SMOOTHING HAPPENS
 					hpoints[x].totalShot = 0.000001;
 					hpoints[x].totalMade = 0;
 					for(var y in hpoints){
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
*/
					d3.selectAll(".shotChartCanvas").remove();
					render();
			}
	
				//////////////////
				//SLIDER VARIABLES
				//////////////////
				var lastPosition = [[0, 0],[0,0]];
				var brushConditions = [1, lastPosition, 0];

				var bottomPCT = 0;
				var topPCT = 1;
	
				//////////////////
				//PERCENTAGE SLIDER
				//////////////////
				var slider = document.getElementById("sub-container-shot1");
	
				if(count !== 0){ //ALL RELOADS AFTER FIRST
					slider.noUiSlider.destroy();
				}
	
				noUiSlider.create(slider, {
					start: [0.0, 1.0],
					step: 0.02,
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
					d3.selectAll(".shotChartCanvas").remove();
					render();
					
					var percentContainer = document.getElementById("sub-container-label1");
					$(percentContainer).css("font-weight", "900")
														.css("color", "#33bdb1");
				})
				
				slider.noUiSlider.on('change', function(){
				var percentContainer = document.getElementById("sub-container-label1");
					$(percentContainer).css("font-weight", "normal")
														.css("color", "#555");
				})
				
				//////////////////
				//SHOT VOLUME SLIDER
				//////////////////
				var sliderShotAttempts =  document.getElementById("sub-container-shot2");
	
				if(count !== 0){
					sliderShotAttempts.noUiSlider.destroy();
				}
					noUiSlider.create(sliderShotAttempts, {
							start: [0.0, 10000],
							snap: true,
							connect: true,
							range: {
								'min': 0,
								'10%': 1,
								'20%': 2,
								'30%': 4,
								'40%': 6,
								'50%': 10,
								'60%': 20,
								'70%': 30,
								'80%': 50,
								'90%': 200,
								'max': 10000
							}
						});

				var bottomAttempts = 0;
				var topAttempts = 10000;

				sliderShotAttempts.noUiSlider.on('slide', function(){
					var sliderCoordinates2 = sliderShotAttempts.noUiSlider.get();
					bottomAttempts = sliderCoordinates2[0];
					topAttempts = sliderCoordinates2[1];
					d3.selectAll(".shotChartCanvas").remove();
					render();
					
					var volumeContainer = document.getElementById("sub-container-label2");
					$(volumeContainer).css("font-weight", "900")
														.css("color", "#33bdb1");
				})

				sliderShotAttempts.noUiSlider.on('change', function(){
					console.log("asd")
					var volumeContainer = document.getElementById("sub-container-label2");
					$(volumeContainer).css("font-weight", "normal")
														.css("color", "#555");
				})

				
				//////////////////
				//SHOT DISTANCE SLIDER
				//////////////////
				var sliderShotDistance =  document.getElementById("sub-container-shot3");
	
				if(count !== 0){
					sliderShotDistance.noUiSlider.destroy();
				}
				
				noUiSlider.create(sliderShotDistance, {
					start: [0.0, 25.0],
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
					
					d3.selectAll(".shotChartCanvas").remove();
					render();
				
					var distanceContainer = document.getElementById("sub-container-label3");
					$(distanceContainer).css("font-weight", "900")
														.css("color", "#33bdb1");
				})
				
				sliderShotDistance.noUiSlider.on('change', function(){
				var percentContainer = document.getElementById("sub-container-label3");
					$(percentContainer).css("font-weight", "normal")
														.css("color", "#555");
				})
				
			function render(){
	
				d3.selection.prototype.moveToFront = function() {
				  return this.each(function(){
				    this.parentNode.appendChild(this);
				  });
				};

				d3.selection.prototype.moveToBack = function() {
				    return this.each(function() { 
				        var firstChild = this.parentNode.firstChild; 
				        if (firstChild) { 
				            this.parentNode.insertBefore(this, firstChild); 
				        } 
				    }); 
				};

				var radiusScale = d3.scale.pow().exponent(0.8)  //Create radius scale for the hexons
				    .domain([0,0,1,2,50])
				    .range([0,0.5,3,5.1,5.1]); 

				var colorScale = d3.scale.linear() //Create color scale for the hexons
				    .domain([-0.4, 0, 0.4]) //Range for +- above average
				    .range(["#35a4b1", "#eeeaea", "#ff8566"]); 

				var x = d3.scale.identity() 
				    .domain([0, width]); 

				var y = d3.scale.linear()
				    .domain([0, height])
				    .range([height, 0]);

				var xAxis = d3.svg.axis() //Axis functions
				    .scale(x)
				    .orient("bottom")
				    .tickSize(6, -height);

				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient("left")
				    .tickSize(6, -width);

				var svg = d3.select("#sub-container-shot").append("svg") //Create top level svg canvas
						.attr("class", "shotChartCanvas")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  	.append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				svg.append("clipPath")//Append clipping path
				    .attr("id", "clip")
				 		.append("rect")
				    .attr("class", "mesh")
				    .attr("width", width)
				    .attr("height", height);

			  var selectedNothing = brushConditions[0]; //1 0 flag for selected nothing
			 	var extent = brushConditions[1]; //Last extent of brush
			 	var lastPercentage = brushConditions[2];
			 	var selectedPercentage = lastPercentage;

				var brushObject = d3.svg.brush() //Creation of brush, but not drawing it until called later
	            	.x(d3.scale.identity().domain([0, width]))
								.y(d3.scale.identity().domain([0, height]))
								.on("brushend", brushEnd)
								.on("brush", brushMove) 
								.extent(extent);

				var brushCanvas = svg.append("g") //Creates canvas for brush as <g> tag
			      .attr("class", "brush")
			      .call(brushObject); 

				//Instead of SVG can put brushCanvs
				var hexagon = svg.append("g") //Adding the hexons // Hexon variable contains all hexons (e.g. array of 428 paths)
				  //.attr("clip-path", "url(#clip)") //Does nothing ?
				  .selectAll(".hexagon")
				    .data(hpoints) //hpoints means smoothed
				 	.enter()
				  	.append("path") //Actual svg hexons element tags <path>
				    .attr("class", "hexagon")
				    .attr("val", function(d) {return d.totalMade/d.totalShot;}) //For debugging purposes mostly
				    //.attr("d", hexbin.hexagon())
				    .attr("d", function(d) {  //Draws the path
				   
				    	    return hexbin.hexagon(0,0).dpoints; //RETURN NOTHING
				    	 
						})  //d data element is the data contained in hexon (hexbin) [ [x,y,made], [x,y,made] ]
				    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				    .style("fill", function(d) {
							return colorScale(d.totalMade/d.totalShot- leagueShotArray[Math.min((Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0)),1749)][2]); //MIN FUNCTION FOR SHOOTERS OUT OF BOUNDS (AHEM AUSTIN DAYE)
						})
				
				
				hexagon.transition().duration(700).ease("bounce").attr("d", function(d) {  //Draws the path
				    	if (d.totalMade/d.totalShot >= bottomPCT && d.totalMade/d.totalShot <= topPCT && d.totalShot >= bottomAttempts && d.totalShot <= topAttempts &&
				    		d.distance >= bottomDistance && d.distance <= topDistance) { //CHECKS IF BETWEEN SLIDER VALUES
				    		return hexbin.hexagon(radiusScale(d.length), 0).dpoints;
				    	} else {
				    	    return hexbin.hexagon(0,0).dpoints; //RETURN NOTHING
				    	    }
						})  //d d
		
/*
 					.on("mouseover", function(d) { //REMOVE
 				       d3.select(this)
          				 .style("fill", "orange");
 				    })
 				    .on("mouseout", function(d) {
 				    	d3.select(this)
          				 .style("fill", function(d){ 
          				 	return colorScale(d.totalMade/d.totalShot- leagueShotArray[(Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0))][2]);}) 
          				})
*/
				brushCanvas.moveToFront();
/*
 				hexagon.on("mousedown", function(){ //Allow dragging from a hexon start point
 						brushCanvas.moveToFront();
 						if(d3.select(this).attr("class") != "hexagon selected"){
 							brush_elm = svg.select(".brush").node()
 							new_click_event = new Event('mousedown');
 							new_click_event.pageX = d3.event.pageX;
 							new_click_event.clientX = d3.event.clientX;
 							new_click_event.pageY = d3.event.pageY;
 							new_click_event.clientY = d3.event.clientY;
							brush_elm.dispatchEvent(new_click_event);
 						}
 					}	
 				);
*/
			    function brushMove() {
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
						}
						return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]
						});

					selectedPercentage = selectedMade/selectedTotal;
					brushConditions[2] = selectedPercentage;

					$("#sub-container-percentage").html('<p class="percentage">Percentage: ' + Math.round(selectedPercentage*1000)/10 +  "% </p>");

			    }

			    function brushEnd() {
		        	if (selectedNothing) {
		        		hexagon.classed("selected", true);
		        	}
		        	//brushCanvas.moveToBack();
		        }

				brushCanvas.call(brushObject.event) //Triggers artificial brush to refresh the selected %
						
				hexagon.classed("selected", function(d) { 
					if(selectedNothing){
						return true; //Select everything
					}else{
						return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]; //Select current extent
					}
	         	}
	         	);
			}
	}