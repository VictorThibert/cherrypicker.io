import d3 from 'd3';
import Hexbin from './Hexbin'
let selectedPlayers = "203935$202340$202323$101138$203092";

setArrays();

var selectedMade = 0;
var selectedTotal = 0;

// brush variables
var lastPosition = [[0, 0],[0,0]];
var brushConditions = [1, lastPosition, 0];
var selectedNothing;
var extent;
var selectedPercentage;

var brushCanvas;
var brushObject;

var margin = {top: 0, right: 20, bottom: 0, left: 20} 
var width = 550 - margin.left - margin.right;
var height = 340 - margin.top - margin.bottom; 

var radiusScale = d3.scale.linear()  // create radius scale for the hexons
	.domain([0,0,1,2,50])
	.range([0,0.5,3,5.1,5.1]);

var colorScale = d3.scale.linear() // create color scale for the hexons
	.domain([-0.4, -0.08, 0, 0.08, 0.4]) // range for +- above average
	.range(["#426AAA", "#6389BA", "#F9DC96", "#F0825F", "#db5757"]); 

// hexagon variables
var hexagon;

var customRadius = 5;
var hpoints;
var hexbin = d3.hexbin().size([width, height]).radius(customRadius); 

// slider variables
var bottomPCT = 0;
var topPCT = 1;
var bottomAttempts = 0;
var topAttempts = 10000;
var bottomDistance = 0;
var topDistance = 500;

var leagueShotArray = [];


function setArrays(){
	
	// league average
	var xmlLeagueRequest = new XMLHttpRequest();
	var urlLeague = "http://cherrypicker.io/php/playershotsleague.php?";
	xmlLeagueRequest.onreadystatechange=function() {
		if (xmlLeagueRequest.readyState == 4 && xmlLeagueRequest.status == 200) {
			reassignLeague(xmlLeagueRequest.responseText);
		}
	}
	xmlLeagueRequest.open("GET", urlLeague, true);
	xmlLeagueRequest.send();

	// push all shots to an array
	function reassignLeague(response) {
		var tempJSONobject = [];
		tempJSONobject = JSON.parse(response); 
		for (var i = 0; i < tempJSONobject.length; i+=1) {
			leagueShotArray.push([parseInt(tempJSONobject[i].LOC_X) + 250, parseInt(tempJSONobject[i].LOC_Y) + 50,  tempJSONobject[i].PERCENTAGE ]);
		} 
	}
	
	// individual players
	var playerShotArray = [];
	var xmlPlayerRequest = new XMLHttpRequest();
	var urlPlayer = "http://cherrypicker.io/php/playershots.php?playerID=" + selectedPlayers; 
	
	xmlPlayerRequest.onreadystatechange=function() {
		if (xmlPlayerRequest.readyState == 4 && xmlPlayerRequest.status == 200) {
			reassignPlayer(xmlPlayerRequest.responseText);
			hpoints = hexbin(playerShotArray);
			d3.selectAll(".shotChartCanvas").remove();
			drawShotchart();
		}
	}
	xmlPlayerRequest.open("GET", urlPlayer, true);
	xmlPlayerRequest.send();
	
	// array the player shots
	function reassignPlayer(response){
		var tempJSONobject2 = [];
		tempJSONobject2 = JSON.parse(response); 
		for (var i = 0; i < tempJSONobject2.length; i+=1) { // playerShotArray contains all the shots
			playerShotArray.push([parseInt(tempJSONobject2[i].LOC_X) + 250, parseInt(tempJSONobject2[i].LOC_Y) + 50, parseInt(tempJSONobject2[i].SHOT_MADE_FLAG), tempJSONobject2[i].SHOT_DISTANCE]);
		} // SHIFT BY 250 IN X AND 50 IN Y
	}
	
}

// when the brush moves (selection on shotchart)
function brushMove() {
	extent = d3.event.target.extent();
	lastPosition = extent;
	brushConditions[1] = lastPosition; 
	
	if(extent[0][0] != extent[1][0] || extent[0][1] != extent[1][1]){ 
		selectedNothing = 0;
		brushConditions[0] = selectedNothing;
	} else { 
		selectedNothing = 1;
		brushConditions[0] = selectedNothing;
	}
	
	selectedMade = 0;
	selectedTotal = 0;
	
	hexagon.classed("selected", function(d) {
		// only find % for viewable hexagons within the selection
		if(extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1] &&
			d3.select(this).attr("d") != "m0,0l0,0l0,0l0,0l0,0l0,0l0,0z" && !(d3.select(this)[0][0].className.baseVal.includes("hidden") )) {
			selectedMade += d.totalMade;
			selectedTotal += d.totalShot;
		}
		return extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]
	});
	
	selectedPercentage = selectedMade/selectedTotal;
	brushConditions[2] = selectedPercentage;
	//  $("#sub-container-shots").html('<p class="percentage">Shots: ' + selectedTotal +  " </p>");
	// selected percentage box set html text
	//  if(isNaN(selectedPercentage)){
	//  	$("#sub-container-percentage").html('<p class="percentage">Shots: ' + selectedTotal +  ' </p><p class="percentage">Percentage: ' + Math.round(selectedPercentage*1000)/10 +  "% </p>");
	//  }
	//  else{
	//  	$("#sub-container-percentage").html('<p class="percentage">Shots: ' + selectedTotal +  ' </p><p class="percentage">Percentage: ' + Math.round(selectedPercentage*1000)/10 +  "% </p>");
	//  }
}

// brush end
function brushEnd() {
	if (selectedNothing) {
		hexagon.classed("selected", true);
	}
}

// draw the shotchart
function drawShotchart(){
	
	// top level svg canvas
	var svg = d3.select("#sub-container-shot").append("svg") 
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
				// return nothing
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
			if (d.totalMade/d.totalShot >= bottomPCT && d.totalMade/d.totalShot <= topPCT && d.totalShot >= bottomAttempts && d.totalShot <= topAttempts &&
				d.distance >= bottomDistance && d.distance <= topDistance) { 
				return hexbin.hexagon(radiusScale(d.length), 0).dpoints;
			} else {
				return hexbin.hexagon(0,0).dpoints; // RETURN NOTHING
			}
	});  
	
	// triggers artificial brush to refresh the selected %
	brushCanvas.call(brushObject.event) 
	
	// which hexagons are selected by the brush
	hexagon.classed("selected", function(d) { 
			if(selectedNothing){
				return true; // Select everything
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
				var firstChild = this.parentNode.firstChild; 
				if (firstChild) { 
						this.parentNode.insertBefore(this, firstChild); 
				} 
		}); 
	};
	
	brushCanvas.moveToFront();
	
}

