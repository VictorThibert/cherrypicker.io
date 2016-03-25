d3.divgrid = function(config) {
  var data3 = config;
  var columns = [];
  var ascending = [];

  var dg = function(selection) {
    if (columns.length == 0) {
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
      .attr("class", function(d,i) { if(i == 0){return "col-0"} else {return i}; }) //HERE TO CHANGE WIDTH OF HEADERS
      .classed("cell", true)


    selection.selectAll(".header .cell")
      .text(function(d) {return data3[d]; })
      .on("click", function(k){resort(k);});

    function resort(k){
      selection.selectAll(".row")
        .sort(function(a,b){
          if (!ascending[k]) {
            
            return (a[k] - b[k]);
          } else {

            return (b[k] - a[k]);
          }
        })
        .transition().duration(500);
        
        ascending[k] = !ascending[k];
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
      .text(function(d,i) { if( i <= 10) {return data3[d]} else {return d;} }); //

    return dg;
  };

  dg.columns = function(_) {
    if (!arguments.length) return columns;
    columns = _;
    return this;
  };

  return dg;
};