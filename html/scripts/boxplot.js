function renderBoxPlots(currentTeamID) {

  renderBox("boxplotID", "PTS", "Points", currentTeamID);
  renderBox("boxplotID", "AST", "Assists", currentTeamID);
  renderBox("boxplotID", "REB", "Rebounds", currentTeamID);
  renderBox("boxplotID", "STL", "Steals", currentTeamID);
  // renderBox("container-BLK", "BLK");
  // renderBox("container-TOV", "TOV");
  // renderBox("container-FG_PCT", "FG_PCT");
  // renderBox("container-FG3_PCT", "FG3_PCT");
  // renderBox("boxplotID", "FT_PCT");

  function renderBox(container, metric, metricString, teamID) {

    var divID = "#" + container;

    d3.select(divID).select("svg").remove(); //remove old boxplots

    var labels = true; // show the text labels beside individual boxplots?

    var margin = {
      top: 20,
      right: 30,
      bottom: 60,
      left: 40
    };
    var width = 250 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var min = Infinity,
      max = -Infinity;

    // parse in the data 
    var data = [];
    data[0] = [];
    data[1] = [];

    var metricText = metricString;
    var axisText = $('#teamName').text();

    // add more rows if your csv file has more columns

    // add here the header of the csv file
    data[0][0] = metric;
    data[1][0] = "League " + metric;

    // add more rows if your csv file has more columns

    data[0][1] = [];
    data[1][1] = [];


    d3.json("http://cherrypicker.io/php/getgamedata.php?teamID=ALLTEAMS", function(error2, raw2) { //Put 30 teams or league average team here

      raw2.forEach(function(x) {
        if (metric == "FG_PCT" || metric == "FG3_PCT" || metric == "FT_PCT") {
          var v2 = x[metric];

          var rowMax2 = v2;
          var rowMin2 = v2;

          data[1][1].push(v2);
          // add more rows if your csv file has more columns

          if (rowMax2 > max) max = rowMax2;
          if (rowMin2 < min) min = rowMin2;

        } else {
          var v2 = Math.floor(x[metric]);

          var rowMax2 = v2;
          var rowMin2 = v2;

          data[1][1].push(v2);
          // add more rows if your csv file has more columns

          if (rowMax2 > max) max = rowMax2;
          if (rowMin2 < min) min = rowMin2;
        }
      });

      next();

    });

    function next() {
      d3.json("http://cherrypicker.io/php/getgamedata.php?teamID=" + teamID, function(error, raw) {

        //raw is entire array of all the objects
        // using an array of arrays with
        // data[n][2] 
        // where n = number of columns in the csv file 
        // data[i][0] = name of the ith column
        // data[i][1] = array of values of ith column
        // data : [[name, [a,b,c,d]] , [name, [a,b,c,d]] , [] []]



        raw.forEach(function(x) {

          if (metric == "FG_PCT" || metric == "FG3_PCT" || metric == "FT_PCT") {
            var v0 = x[metric];

            //v1 = Math.floor(x.AST);

            // add more variables if your csv file has more columns

            var rowMax = Math.max(v0);
            var rowMin = Math.min(v0);

            data[0][1].push(v0);
            //data[1][1].push(v1);

            // add more rows if your csv file has more columns

            if (rowMax > max) max = rowMax;
            if (rowMin < min) min = rowMin;


          } else {
            var v0 = Math.floor(x[metric]);
            //v1 = Math.floor(x.AST);

            // add more variables if your csv file has more columns

            var rowMax = Math.max(v0);
            var rowMin = Math.min(v0);

            data[0][1].push(v0);
            //data[1][1].push(v1);

            // add more rows if your csv file has more columns

            if (rowMax > max) max = rowMax;
            if (rowMin < min) min = rowMin;
          }
        });

        var boxpadding = 10;


        var chart = d3.box()
          .whiskers(iqr(10)) //set to 1 to see outliers
          .height(height)
          .domain([min - boxpadding, max + boxpadding])
          .showLabels(labels);

        var svg = d3.select(divID).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("class", "box")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // the x-axis
        var x = d3.scale.ordinal()
          .domain(data.map(function(d) {
            return d[0]
          }))
          .rangeRoundBands([0, width], 0.5, 0.5);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        // the y-axis
        var y = d3.scale.linear()
          .domain([min - boxpadding, max + boxpadding])
          .range([height + margin.top, 0 + margin.top]);

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");
        

        svg.append("linearGradient") //gradient
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0).attr("y1", "0%")
          .attr("x2", 0).attr("y2", "100%")
          .selectAll("stop")
          .data([{
            offset: "0%",
            color: '#3e66a8'
          }, {
            offset: "100%",
            color: "red"
          }])
          .enter().append("stop")
          .attr("offset", function(d) {
            return d.offset;
          })
          .attr("stop-color", function(d) {
            return d.color;
          });
        
        svg.append("linearGradient") //gradient
          .attr("id", "line-gradient2")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0).attr("y1", "0%")
          .attr("x2", 0).attr("y2", "100%")
          .selectAll("stop")
          .data([{
            offset: "0%",
            color: '#b5c7e3'
          }, {
            offset: "100%",
            color: "#ff8080"
          }])
          .enter().append("stop")
          .attr("offset", function(d) {
            return d.offset;
          })
          .attr("stop-color", function(d) {
            return d.color;
          });

        // draw the boxplots  
        svg.selectAll(".box")
          .data(data)
          .enter().append("g")
          .attr("transform", function(d) {
            return "translate(" + x(d[0]) + "," + margin.top + ")";
          })
          .call(chart.width(x.rangeBand() / 3)); // change width here


        // add a title
        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 + (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .style("fill", "#444")
        
          //.style("text-decoration", "underline")  
          .text(metricText);

        // draw y axis
        svg.append("g")
          .attr("class", "y axis")
    
          .call(yAxis)
 
          .append("text") // and text1
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("x", -35)
          .style("text-anchor", "end")
          .style("font-size", "12px")
          .style("fill", "#444")
          .text(metricText);

        // draw x axis  
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + margin.top) + ")")
          .call(xAxis)
          .append("text") // text label for the x axis
          .attr("x", (width / 2))
          .attr("y", 10)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#444")

      });
    }


    // Returns a function to compute the interquartile range.
    function iqr(k) {
      return function(d, i) {
        var q1 = d.quartiles[0],
          q3 = d.quartiles[2],
          iqr = (q3 - q1) * k,
          i = -1,
          j = d.length;

        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        //console.log([k, i,j, q1, q3]);
        return [i, j];
      };
    }

  }



}