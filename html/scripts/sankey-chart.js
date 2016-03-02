function sankeyRender(team){

var dataB = [];
var id = team;

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=16106127" + id, function(error, raw){
  var i = 0;
  for(i = 0; i < raw.length; i += 1){
    dataB[i] = [
          raw[i].PLAYER_NAME, //                                              [0]
          raw[i].FGA / raw[i].GP, //  shot                                    [1]
          raw[i].AST/ raw[i].GP, //   fouled                                  [2]
          (raw[i].FTA * 0.44)/ raw[i].GP, //                                  [3]
          raw[i].TOV/ raw[i].GP, //                                           [4]
          (parseInt(raw[i].FGA) + +raw[i].FTA  * 0.44 + +raw[i].AST + +raw[i].TOV)/ raw[i].GP]//   [5]
          .map(function(d){
            if(!isNaN(d)){ 
              return parseFloat(d).toFixed(2);
              } else{return d;}
            }); 
          //console.log([raw[i].PLAYER_NAME, raw[i].FGA / raw[i].GP])

    }
    

    sankeyFormat(dataB);
});

function sankeyFormat(dataC){
  dataC.sort(function(a,b){
          return b[5] - +a[5];
        });
  var sankeyData = {"nodes":[{}], "links":[]};
      sankeyData.nodes[0].node = 0;
      sankeyData.nodes[0].name = "PONR";
      for (var i = 0; i < 6; i += 1){
        sankeyData.nodes.push({"node": i + 1, "name":dataC[i][0]});
      }
      sankeyData.nodes.push({"node": 7, "name":"Other"});
      sankeyData.nodes.push({"node": 8, "name":"Shot"});
      sankeyData.nodes.push({"node": 9, "name":"Assist"});
      sankeyData.nodes.push({"node": 10, "name":"Fouled"});
      sankeyData.nodes.push({"node": 11, "name":"Turnover"});

      for (var i = 0; i < 6; i += 1){
        sankeyData.links.push({"source": 0, "target": i + 1, "value":dataC[i][5]});
    
      }

      var otherPONR = 0;
      var otherShot = 0;
      var otherAssist = 0;
      var otherFouled = 0;
      var otherTurnover = 0;

      for (var i = 6; i < dataC.length; i += 1){
        otherPONR += +dataC[i][5];
        otherShot += +dataC[i][1];
        otherAssist += +dataC[i][2];
        otherFouled += +dataC[i][3];
        otherTurnover += +dataC[i][4];
      }
      sankeyData.links.push({"source": 0, "target": 7, "value":otherPONR});

      for (var i = 0; i < 6; i += 1){
        for (var j = 0; j < 4; j += 1){
          sankeyData.links.push({"source": i + 1, "target": j + 8, "value": dataC[i][j + 1]});
        }           
      }

      sankeyData.links.push({"source": 7, "target": 8, "value":otherShot});
      sankeyData.links.push({"source": 7, "target": 9, "value":otherAssist});
      sankeyData.links.push({"source": 7, "target": 10, "value":otherFouled});
      sankeyData.links.push({"source": 7, "target": 11, "value":otherTurnover});
 
      //console.log(sankeyData)

      renderSankey(sankeyData);

  function renderSankey(x){

    d3.select("#sub-container-sank").selectAll("svg").remove();

    var units = "Possessions PONR";

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.linear().domain([0,70])
          .range(["red", "blue"])
    // append the svg canvas to the page
    var svg = d3.select("#sub-container-sank").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    // load the data
    graph = x; {

      sankey
          .nodes(graph.nodes)
          .links(graph.links)
          .layout(32);

    // add in the links
      var link = svg.append("g").selectAll(".link")
          .data(graph.links)
        .enter().append("path")
          .attr("class", "link")
          .attr("d", path)
          .style("stroke-width", function(d) { return Math.max(1, d.dy); })
          .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
      link.append("title")
            .text(function(d) {
            return d.source.name + " → " + 
                    d.target.name + "\n" + format(d.value); });

    // add in the nodes
      var node = svg.append("g").selectAll(".node")
          .data(graph.nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.behavior.drag()
          .origin(function(d) { return d; })
          .on("dragstart", function() { 
          this.parentNode.appendChild(this); })
          .on("drag", dragmove));

    // add the rectangles for the nodes
      node.append("rect")
          .attr("height", function(d) { return d.dy; })
          .attr("width", sankey.nodeWidth())
          .attr("opacity", 0.7)
          .style("fill", function(d) {
          return d.color = color(d.dy); })
        .append("title")
          .text(function(d) { 
          return d.name + "\n" + format(d.value); });

    // add in the title for the nodes
      node.append("text")
          .attr("x", -6)
          .attr("y", function(d) { return d.dy / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .attr("transform", null)
          .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
          .attr("x", 6 + sankey.nodeWidth())
          .attr("text-anchor", "start");

    // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr("transform", 
            "translate(" + d.x + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
        sankey.relayout();
        link.attr("d", path);
      }
    };
  }

}
}
