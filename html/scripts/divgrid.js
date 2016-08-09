d3.divgrid = function(config) {
  var headers = config;
  var columns = [];
  var ascending = [];

  var dg = function(selection) {
    if (columns.length === 0) {
      columns = d3.keys(selection.data()[0][0]);
      ascending = columns.map(function(i) {return false;});
    }

    // header
    selection.selectAll(".header")
        .data([true])
      .enter().append("div")
        .attr("class", "header")

    var header = selection.select(".header")
      .selectAll(".cell")
      .data(columns);

    header.enter().append("div")
      .attr("class", function(d,i) { 
        if(i === 0) {
          return "col-0";
        } else if (i == 8) {
          return "col-8";
        } else if (i === 9) {
          return "col-9";
        } else {
          return i;
        } 
    }) //HERE TO CHANGE WIDTH OF HEADERS
      .classed("cell", true)

    //what happens when you click a header
    selection.selectAll(".header .cell")
      .text(function(d) {return headers[d]; })
      .on("click", function(k){
      
        var colorScale = d3.scale.linear().domain([10,20]).range(["red", "blue"]);;

        //depending on which column clicked
        switch(k){
          case "0": //name
            colorScale = d3.scale.linear().domain(["a","b"]).range(["red", "red"]);
            break;
          case "1": //minutes
            colorScale = d3.scale.linear().domain([10,30]).range(["red", "blue"]);
            break;
          case "2": //fg
            colorScale = d3.scale.linear().domain([0.3,0.5]).range(["red", "blue"]);
            break;
          case "3": //3p
            colorScale = d3.scale.linear().domain([0.1,0.4]).range(["red", "blue"]);
            break;
          case "4": //ft
            colorScale = d3.scale.linear().domain([0.5,0.9]).range(["red", "blue"]);
            break;
          case "5": //ppg
            colorScale = d3.scale.linear().domain([5,15]).range(["red", "blue"]);
            break;  
          case "6": //apg
            colorScale = d3.scale.linear().domain([1,7]).range(["red", "blue"]);
            break; 
          case "7": //rpg
            colorScale = d3.scale.linear().domain([2,9]).range(["red", "blue"]);
            break;
          case "8": //spg
            colorScale = d3.scale.linear().domain([0,1.5]).range(["red", "blue"]);
            break;
          case "9": //bpg
            colorScale = d3.scale.linear().domain([0,1]).range(["red", "blue"]);
            break;             
        }
      

    
        pc.color(function(d) {
            return colorScale(d[k]);
          }
        ); 
        pc.render();
    

          resort(k);
         }
       );

    //k is the number of the column being sorted
    function resort(k){
      if(k == 0){ //First column
        selection.selectAll(".row")
        .sort(function(a,b){
          if (!ascending[k]) {
            return (a[k].localeCompare(b[k]));
          } else {
            return (b[k].localeCompare(a[k]));
          }
        })
        .transition().duration(500);
        
        var temp = !ascending[k];
        ascending.map(function() {return true;} )
        ascending[k] = temp;
        
        
      } else {
        selection.selectAll(".row")
          .sort(function(a,b){
            if (ascending[k]) {
              return (a[k] - b[k]);
            } else {
              return (b[k] - a[k]);
            }
          })
          .transition().duration(500);

          var temp = !ascending[k];
          ascending.map(function(x, i, ar){
              ar[i] = false;
          });
          //console.log(ascending)
          ascending[k] = temp;
      }
    }

    

    header.exit().remove();

    // rows
    var rows = selection.selectAll(".row")
        .data(function(d) { return d; })

    rows.enter().append("div")
        .attr("class", "row")

    rows.exit().remove();

    var cells = selection.selectAll(".row").selectAll(".cell")
        .data(function(d) { return columns.map(function(col){return d[col];}) })

    // cells
    cells.enter().append("div")
      .attr("class", function(d,i) { return "col-" + i; })
      .classed("cell", true)

      cells.exit().remove();

    selection.selectAll(".cell")
      .text(function(d,i) { if( i <= 9) {return headers[d]} else {return d;} }); //HARDOCODED 9 / HOW MANY PARAMETERS, PPG, SPG, RPG etc headers

    return dg;
  };

  dg.columns = function(_) {
    if (!arguments.length) return columns;
    columns = _;
    return this;
  };

  return dg;
};