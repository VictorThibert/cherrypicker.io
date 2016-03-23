function renderCalendar(container, year1, year2){
//   console.log(container, year1, year2)

  var lastDay = new Date(year1, parseInt(container) + 1, 0);
  var firstDay = new Date(year1, parseInt(container), 1);
  var weekOfLastDay = d3.time.weekOfYear(lastDay) - d3.time.weekOfYear(firstDay);

  var width = 110; //width
  var height = 136;
  var cellSize = 15; // cell size
  var baselineWidth = 60;


  switch(weekOfLastDay){
    case 3:
      width = baselineWidth;
      break;
    case 4:
      width = baselineWidth + cellSize;
      break;
    case 5:
      width = baselineWidth + 2 * cellSize;
      break;
  }

  var monthDiv = "#m" + container;


  
  var percent = d3.format(".1%"),
      format = d3.time.format("%Y-%m-%d");

  var color = d3.scale.linear()
    .domain([-60,0,60])
    .range(["red", "#EEE", "#00cc7a"]);


  var svg = d3.select(monthDiv).selectAll("svg")
      .data(d3.range(year1, year2))
    .enter().append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "RdYlGn")
    .append("g")
      .attr("transform", "translate(" + 0 + "," + (height - cellSize * 7 - 1) + ")");



  svg.append("text")
      .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
      .style("text-anchor", "middle")
      .text(function(d) { return d; });


  var rect = svg.selectAll(".day")
      .data(function(d) { 
        return d3.time.days(new Date(d, parseInt(container), 1), new Date(d, parseInt(container) + 1, 1)); }) //notice 1 less
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("x", function(d) { return ((d3.time.weekOfYear(d) - d3.time.weekOfYear(d3.time.day(new Date(year1, parseInt(container), 1))) + 52) % 52 * cellSize); }) // week shift
      .attr("y", function(d) { return d.getDay() * cellSize + 1.5; })
      .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("ANYTHING"+ "<br/>"  + d.close)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
      .datum(format);

      var temp = [];

      fillDaysByMonth(parseInt(container), year1);

  function fillDaysByMonth(month, year){

    var fillerdays = [];

    var daysOfMonth = d3.time.days(new Date(year, month, 1), new Date(year, month + 1, 1));

    var first = daysOfMonth[0];
    var last = daysOfMonth[daysOfMonth.length - 1];

    for (var i = 0; i < first.getDay(); i += 1){
      temp.push(d3.time.day(new Date(year1, month, 0 - i)));
    }

    var count = 1;
    for (var i = last.getDay(); i < 6; i += 1 ){
      temp.push(d3.time.day(new Date(year, month + 1, count)));
      count += 1;
    }
  }
  var fillerrect = svg.selectAll(".fillerday")
      .data(temp)
    .enter().append("rect")
      .attr("class", "fillerday")
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("x", function(d) { return ((d3.time.weekOfYear(d) - d3.time.weekOfYear(d3.time.day(new Date(year1, parseInt(container), 1))) + 52) % 52 * cellSize); }) //1.2 spacing
      .attr("y", function(d) { return d.getDay() * cellSize + 1.5; })
      
      .datum(format);
  
  var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);




  rect.append("title")
      .text(function(d) { return d; });

  var plusminus = 0;
  var count = 0;

  d3.json("http://cherrypicker.io/php/getgamedata.php?teamID=1610612737", function(error, raw){
    if (error){
      throw error;
    }

    if (count == 0){
      var firstGame = raw[0].GAME_DATE_EST;
      firstGame = new Date(firstGame.slice(0,4), firstGame.slice(4,6) - 1, firstGame.slice(6,8));
      var lastGame = raw[raw.length - 1].GAME_DATE_EST;
      lastGame = new Date(lastGame.slice(0,4), lastGame.slice(4,6) - 1, lastGame.slice(6,8));
      
      var regularSeason = d3.time.days(firstGame, lastGame);


      function merge_options(obj1,obj2){
          var obj3 = {};
          for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
          for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
          return obj3;
      }

      var data2= {};

      for (var i = 0; i < regularSeason.length; i += 1) {
        var x = regularSeason[i];
        x = new Date(x);
 
        key = x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2);
        data2[key] = 0;
      }

      var data = d3.nest()
        .key(function(d) { 
          var e = d.GAME_DATE_EST; 
          return e.slice(0,4) + "-" + e.slice(4,6) + "-" + e.slice(6,8);})
        .rollup(function(d,i) {/*plusminus += parseInt(d[0].WIN * 2 - 1); */return parseInt(d[0].PLUS_MINUS);})
        .map(raw);


      var data3 = merge_options(data2, data);

      var corresponding = [0];

      rect.filter(function(d) { return d in data3; }) //returns the days in the div for that month
        .style("fill", function(d){return color(data3[d]); })
       .select("title")
        .text(function(d) { return d + ": " + data3[d];}); 

        count +=1;

      
    }

   
  });



  d3.select(self.frameElement).style("height", "2910px");
}