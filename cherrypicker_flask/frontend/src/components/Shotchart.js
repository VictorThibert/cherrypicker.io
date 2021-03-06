import d3 from 'd3';
import './Hexbin'


let capsule = function(selectedPlayers = "203935$202340$202323$101138$203092"){


  let node = document.createElement('div');
  node.setAttribute("id", "shotchart")

  // size of graphic
  let margin = {top: 0, right: 20, bottom: 0, left: 20} 
  let width = 550 - margin.left - margin.right;
  let height = 340 - margin.top - margin.bottom; 

  // radius scale for hexagons
  let radiusScale = d3.scale.linear()  
    .domain([0,0,1,2,50])
    .range([0,0.5,3,5.1,5.1]);

  // colour scale for hexagons
  let colorScale = d3.scale.linear() 
    .domain([-0.4, -0.08, 0, 0.08, 0.4]) // range for +- above average
    .range(["#426AAA", "#6389BA", "#F9DC96", "#F0825F", "#db5757"]); 

  let customRadius = 5;
  let hexbin = d3.hexbin().size([width, height]).radius(customRadius); 

  let brushConditions = [1, [[0, 0],[0,0]], 0];
  let selectedNothing, extent, selectedPercentage, brushCanvas, brushObject, hexagon, hpoints;
  	
  // league average
  let leagueShotArray = [];
  let xmlLeagueRequest = new XMLHttpRequest();
  // individual players
  let playerShotArray = [];
  let xmlPlayerRequest = new XMLHttpRequest();
  
  // for league
  xmlLeagueRequest.onreadystatechange=function() {
  	if (xmlLeagueRequest.readyState === 4 && xmlLeagueRequest.status === 200) {
  		reassignLeague(xmlLeagueRequest.responseText);
  	}
  }
  xmlLeagueRequest.open("GET", "http://cherrypicker.io/php/playershotsleague.php?", true);
  xmlLeagueRequest.send();

  // for players
  xmlPlayerRequest.onreadystatechange=function() {
  	if (xmlPlayerRequest.readyState === 4 && xmlPlayerRequest.status === 200) {
  		reassignPlayer(xmlPlayerRequest.responseText);
  		hpoints = hexbin(playerShotArray);
  		d3.selectAll(".shotChartCanvas").remove();
  		drawShotchart();
  	}
  }
  xmlPlayerRequest.open("GET", "http://cherrypicker.io/php/playershots.php?playerID=" + selectedPlayers, true);
  xmlPlayerRequest.send();

  function reassignLeague(response) {
    let tempJSONobject = JSON.parse(response); 
    for (let i = 0; i < tempJSONobject.length; i+=1) {
      leagueShotArray.push([parseInt(tempJSONobject[i].LOC_X, 10) + 250, parseInt(tempJSONobject[i].LOC_Y, 10) + 50,  tempJSONobject[i].PERCENTAGE ]);
    } 
  }

  function reassignPlayer(response){
  	let tempJSONobject2 = JSON.parse(response); 
  	for (let i = 0; i < tempJSONobject2.length; i+=1) { // playerShotArray contains all the shots
  		playerShotArray.push([parseInt(tempJSONobject2[i].LOC_X, 10) + 250, parseInt(tempJSONobject2[i].LOC_Y, 10) + 50, parseInt(tempJSONobject2[i].SHOT_MADE_FLAG, 10), tempJSONobject2[i].SHOT_DISTANCE]);
  	} // shift by 250 in x and 50 in y
  }


  // when the brush moves (selection on shotchart)
  function brushMove() {
  	extent = d3.event.target.extent();
  	brushConditions[1] = extent; // set to last position
  	
  	if(extent[0][0] !== extent[1][0] || extent[0][1] !== extent[1][1]){ 
  		selectedNothing = 0;
  		brushConditions[0] = selectedNothing;
  	} else { 
  		selectedNothing = 1;
  		brushConditions[0] = selectedNothing;
  	}
  	
  	let selectedMade = 0;
  	let selectedTotal = 0;
  	
    if(selectedNothing){
      hexagon.each(function(d){
        if(!(d3.select(this)[0][0].className.baseVal.includes("hidden"))){
          selectedMade += d.totalMade;
          selectedTotal += d.totalShot;
        }
      })
    } else {

      hexagon.classed("selected", function(d) {
      // only find % for viewable hexagons within the selection
        if(extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1] &&
          d3.select(this).attr("d") !== "m0,0l0,0l0,0l0,0l0,0l0,0l0,0z" && !(d3.select(this)[0][0].className.baseVal.includes("hidden") )) {
          selectedMade += d.totalMade;
          selectedTotal += d.totalShot;
        }
        return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]
      });

    }
  	
  	selectedPercentage = selectedMade/selectedTotal;
  	brushConditions[2] = selectedPercentage;
  	
    d3.select("#container-percentage").html('<p class="percentage">Shots: ' + selectedTotal +  ' </p><p class="percentage">Percentage: ' + Math.round(selectedPercentage*1000)/10 +  "% </p>");
    
  }

  // brush end
  function brushEnd() {
  	if (selectedNothing) {
  		hexagon.classed("selected", true); // un greys out the chart
  	}
  }

  // draw the shotchart
  function drawShotchart(){
  	
  	let svg = d3.select("#shotchart").append("svg") 
  		.attr("class", "shotChartCanvas")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  	
  	selectedNothing = brushConditions[0]; // 1 0 flag for selected nothing
  	extent = brushConditions[1]; // last extent of brush
  	selectedPercentage = brushConditions[2];
  	
  	// creation of brush, but not drawing it until called later
  	brushObject = d3.svg.brush() 
  		.x(d3.scale.identity().domain([0, width]))
  		.y(d3.scale.identity().domain([0, height]))
  		.on("brushend", brushEnd)
  		.on("brush", brushMove) 
  		.extent(extent);
  	
  	// creates canvas for brush as <g> tag
  	brushCanvas = svg.append("g") 
  		.attr("class", "brush")
  		.call(brushObject); 
  	
  	// adding all the hexagons
  	hexagon = svg.append("g") 
  		.selectAll(".hexagon")
  			.data(hpoints) 
  		.enter()
  			.append("path") 
  			.attr("class", "hexagon")
  			.attr("d", function(d) {  
  				// d data element is the data contained in hexon (hexbin) [ [x,y,made], [x,y,made] ]
  				return hexbin.hexagon(0,0).dpoints; 
  			})  
  			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  			.style("fill", function(d) {
  				return colorScale(d.totalMade/d.totalShot - leagueShotArray[Math.min((Math.round(d.x/10.0) * 35 + Math.round(d.y/10.0)),1749)][2]); 
  			})
  			
  	
  	// transition
  	hexagon
  		.transition()
  		.duration(700)
  		.ease("quad")
  		.attr("d", function(d) {  
  			// draw paths (see if value in between sliders)

  				return hexbin.hexagon(radiusScale(d.length), 0).dpoints;
  			
  	});  
  	
  	// triggers artificial brush to refresh the selected %
  	refresh();
  	
  	// which hexagons are selected by the brush
  	hexagon.classed("selected", function(d) { 
  			if(selectedNothing){
  				return true; //  select everything
  			} else {
  				return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]; // Select current extent
  			}
  		}
  	);
  	
  	d3.selection.prototype.moveToFront = function() {
  		return this.each(function(){
  			this.parentNode.appendChild(this);
  		});
  	};
  	
  	d3.selection.prototype.moveToBack = function() {
  		return this.each(function() { 
  				let firstChild = this.parentNode.firstChild; 
  				if (firstChild) { 
  						this.parentNode.insertBefore(this, firstChild); 
  				} 
  		}); 
  	};
  	
    function refresh(){
      brushCanvas.call(brushObject.event);
    }
  	brushCanvas.moveToFront();

  	return refresh
  }

  return {node:node, brush:drawShotchart()} // puts the refresh function into brush object to pass to upwards

}
export default capsule;
