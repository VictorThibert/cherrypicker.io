var dataB = [];

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=1610612737", function(error, raw){
  var i = 0;
  for(i = 0; i < raw.length; i += 1){
    dataB[i] = [
          raw[i].PLAYER_NAME, //                                              [0]
          (raw[i].FGA - raw[i].FG3A - (raw[i].FGM - raw[i].FG3M)) / raw[i].GP,//[1]
          (raw[i].FGM - raw[i].FG3M) / raw[i].GP, //2 pointers made           [2]
          (raw[i].FG3A - raw[i].FG3M) / raw[i].GP, //                         [3]
          raw[i].FG3M/ raw[i].GP, //                                          [4]
          (raw[i].FTA - raw[i].FTM)/ raw[i].GP,  //                           [5]
          raw[i].FTM/ raw[i].GP, //                                           [6]
          raw[i].AST/ raw[i].GP,  //                                          [7]
          raw[i].TOV/ raw[i].GP, //                                           [8]
          (parseInt(raw[i].FGA) + +raw[i].FTA + +raw[i].AST + +raw[i].TOV)/ raw[i].GP]//   [9]
          .map(function(d){
            if(!isNaN(d)){ 
              return parseFloat(d).toFixed(2);
              } else{return d;}
            }); 
    }
    sankeyFormat(dataB);
});

function sankeyFormat(dataC){
  dataC.sort(function(a,b){
          return b[9] - +a[9];
        });
  var sankeyData = {"nodes":[{}], "links":[]};
      sankeyData.nodes[0].node = 0;
      sankeyData.nodes[0].name = "PONR";
      for (var i = 0; i < 6; i += 1){
        sankeyData.nodes.push({"node": i + 1, "name":dataC[i][0]});
      }
      sankeyData.nodes.push({"node": 7, "name":"Other"});
      sankeyData.nodes.push({"node": 8, "name":"2PT FG Missed"});
      sankeyData.nodes.push({"node": 9, "name":"2PT FG Made"});
      sankeyData.nodes.push({"node": 10, "name":"3PT FG Missed"});
      sankeyData.nodes.push({"node": 11, "name":"3PT FG Made"});
      sankeyData.nodes.push({"node": 12, "name":"FT Missed"});
      sankeyData.nodes.push({"node": 7, "name":"FT Made"});
      sankeyData.nodes.push({"node": 7, "name":"Assists"});
      sankeyData.nodes.push({"node": 7, "name":"Turnovers"});

      for (var i = 0; i < 6; i += 1){
        sankeyData.links.push({"source": 0, "target": i + 1, "value":dataC[i][9]});
    
      }

      var otherPONR = 0;
      var other2PMissed = 0;
      var other2PMade = 0;
      var other3PMissed = 0;
      var other3PMade = 0;
      var otherFTMissed = 0;
      var otherFTMade = 0;
      var otherAssists = 0;
      var otherTOV = 0;

      for (var i = 6; i < dataC.length; i += 1){
        otherPONR += +dataC[i][9];
        other2PMissed += +dataC[i][1];
        other2PMade += +dataC[i][2];
        other3PMissed += +dataC[i][3];
        other3PMade += +dataC[i][4];
        otherFTMissed += +dataC[i][5];
        otherFTMade += +dataC[i][6];
        otherAssists += +dataC[i][7];
        otherTOV += +dataC[i][8];

      }
      sankeyData.links.push({"source": 0, "target": 7, "value":otherPONR});

      for (var i = 0; i < 6; i += 1){
        for (var j = 0; j < 8; j += 1){
          sankeyData.links.push({"source": i + 1, "target": j + 8, "value": dataC[i][j + 1]});
        }           
      }

      sankeyData.links.push({"source": 7, "target": 8, "value":other2PMissed});
      sankeyData.links.push({"source": 7, "target": 9, "value":other2PMade});
      sankeyData.links.push({"source": 7, "target": 10, "value":other3PMissed});
      sankeyData.links.push({"source": 7, "target": 11, "value":other3PMade});
      sankeyData.links.push({"source": 7, "target": 12, "value":otherFTMissed});
      sankeyData.links.push({"source": 7, "target": 13, "value":otherFTMade});
      sankeyData.links.push({"source": 7, "target": 14, "value":otherAssists});
      sankeyData.links.push({"source": 7, "target": 15, "value":otherTOV});

      console.log(sankeyData);
      renderSankey(sankeyData);

  function renderSankey(x){

    var units = "Possessions PONR";

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.category20();

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
        .nodePadding(20)
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
          .style("fill", function(d) { 
          return d.color = color(d.name.replace(/ .*/, "")); })
          .style("stroke", function(d) { 
          return d3.rgb(d.color).darker(2); })
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
