renderBox("container-PTS", "PTS");
renderBox("container-AST", "AST");
renderBox("container-REB", "REB");
renderBox("container-STL", "STL");
renderBox("container-BLK", "BLK");
renderBox("container-TOV", "TOV");
renderBox("container-FG_PCT", "FG_PCT");
renderBox("container-FG3_PCT", "FG3_PCT");
renderBox("container-FT_PCT", "FT_PCT");

function renderBox(container, metric){

  var divID = "#" + container;


  var labels = true; // show the text labels beside individual boxplots?

  var margin = {top: 30, right: 30, bottom: 70, left: 30};
  var  width = 200 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;
    
  var min = Infinity,
      max = -Infinity;
    
  // parse in the data 

  var data = [];
    data[0] = [];
    data[1] = [];
   
    // add more rows if your csv file has more columns

    // add here the header of the csv file
    data[0][0] = metric;
    data[1][0] = "League " + metric;
    
    // add more rows if your csv file has more columns

    data[0][1] = [];
    data[1][1] = [];


  d3.json("http://cherrypicker.io/php/getgamedata.php?teamID=1600000000", function(error2, raw2) {

      raw2.forEach(function(x) {
        if(metric == "FG_PCT" || metric == "FG3_PCT" || metric == "FT_PCT"){
          var v2 = x[metric];

          var rowMax2 = v2;
          var rowMin2 = v2;

          data[1][1].push(v2);     
           // add more rows if your csv file has more columns
           
          if (rowMax2 > max) max = rowMax2;
          if (rowMin2 < min) min = rowMin2; 

        }else{
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
    d3.json("http://cherrypicker.io/php/getgamedata.php?teamID=1610612737", function(error, raw) {

    //raw is entire array of all the objects
      // using an array of arrays with
      // data[n][2] 
      // where n = number of columns in the csv file 
      // data[i][0] = name of the ith column
      // data[i][1] = array of values of ith column
      // data : [[name, [a,b,c,d]] , [name, [a,b,c,d]] , [] []]

      
      
      raw.forEach(function(x) {

        if(metric == "FG_PCT" || metric == "FG3_PCT" || metric == "FT_PCT"){
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


        }else{
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
      
      var chart = d3.box()
        .whiskers(iqr(50))
        .height(height) 
        .domain([min, max])
        .showLabels(labels);

      var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "box")    
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // the x-axis
      var x = d3.scale.ordinal()     
        .domain( data.map(function(d) {return d[0] } ) )     
        .rangeRoundBands([0 , width], 0.7, 0.3);    

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      // the y-axis
      var y = d3.scale.linear()
        .domain([min, max])
        .range([height + margin.top, 0 + margin.top]);
      
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      // draw the boxplots  
      svg.selectAll(".box")    
          .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
          .call(chart.width(x.rangeBand() / 3));  // change width here
      
            
      // add a title
      svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 + (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "12px") 
            //.style("text-decoration", "underline")  
            .text(metric);
     
       // draw y axis
      svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text") // and text1
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", "12px") 
          .text(metric);    
      
      // draw x axis  
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
          .call(xAxis)
        .append("text")             // text label for the x axis
            .attr("x", (width / 2) )
            .attr("y",  10 )
        .attr("dy", ".71em")
            .style("text-anchor", "middle")
        .style("font-size", "12px") 
            .text("-"); 
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

