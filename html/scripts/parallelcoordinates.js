//data stored in 2d array. inner arrays represent path lines
function renderPara(teamID){

  // window.history.pushState(“object or string”, “Title”, “/atlanta”);
  var headers = ["Player", "Minutes", "FG%", "3P%", "FT%", "PPG", "APG", "RPG", "SPG", "BPG"]; //ADD TOV
  
  renderPara2(headers);
  
  var data = [];
  
  d3.select("#example").selectAll("svg").remove();
  d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=" + teamID, function(error, raw){
    var i = 0;
    for(i = 0; i < raw.length; i += 1){
      data[i] = [raw[i].PLAYER_NAME,
                  raw[i].MIN / raw[i].GP,
                  raw[i].FG_PCT,
                  raw[i].FG3_PCT,
                  raw[i].FT_PCT,
                  raw[i].PTS/ raw[i].GP,
                  raw[i].AST/ raw[i].GP,
                  raw[i].REB/ raw[i].GP,
                  raw[i].STL/ raw[i].GP, //ADD TOV
                  raw[i].BLK/ raw[i].GP]
        .map(function(d){
        if(!isNaN(d)){ 
          return parseFloat(d).toFixed(2);
        }
        else{return d;}}) }
    render();
  });

  
function render() {

  var dimensions = { "protein": {type:"number"} };
  
  var colorScale = d3.scale.linear().domain([10,20])
    .range(["red", "blue"])
 

  pc = d3.parcoords()("#example")
  
  .data(data)
  .render()
  .createAxes();

  pc.ctx.foreground.lineWidth = 2;
  pc.ctx.foreground.globalCompositeOperation = "darken";
  
  pc
    .smoothness(0.1) //REIMPLEMENT CURVATURE
    .alpha(0.3)
  
    .composite("darken")
    .rate(60)
    .margin({ top: 25, left: 70, bottom: 10, right: 40})
    .autoscale()
    .color(function(d) {return colorScale(d[1]);})
   
    .brushMode("1D-axes")

    .render()
  

 

}


//divgrid stuff happens here
var grid = d3.divgrid(headers);
var data2 = [];

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=" + teamID, function(error, raw){

  var i = 0;
  for(i = 0; i < raw.length; i += 1){
    data2[i] = [raw[i].PLAYER_NAME, raw[i].MIN / raw[i].GP, raw[i].FG_PCT, raw[i].FG3_PCT, raw[i].FT_PCT, raw[i].PTS/ raw[i].GP, raw[i].AST/ raw[i].GP, raw[i].REB/ raw[i].GP, raw[i].STL/ raw[i].GP, raw[i].BLK/ raw[i].GP].map(function(d){if(!isNaN(d)){ return parseFloat(d).toFixed(2);}else{return d;}})
  } //ADD TOV
  
  d3.select('#grid')
    .datum(data2)
    .call(grid)
    .selectAll(".row")
    .on({
      "mouseover": function(d) { 
        this.style.backgroundColor = "#EEE";
        pc.highlight([d]); 
      },
      "mouseout": function(d) { 
        pc.unhighlight([d]);
        this.style.backgroundColor = null;},     
 
    
    });
  
  

    pc.on("brush", function(d) {
    d3.select("#grid")
      .datum(d)
      .call(grid)
      .selectAll(".row")
      .on({
        "mouseover": function(d) {
        this.style.backgroundColor = "#EEE";
        pc.highlight([d]);  },
        "mouseout": function(d) { 
        pc.unhighlight([d]);
       this.style.backgroundColor = null;}
    
    });
   });   
});
}
