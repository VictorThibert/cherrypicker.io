//data stored in 2d array. inner arrays represent path lines
function renderPara(x){

  // window.history.pushState(“object or string”, “Title”, “/atlanta”);
  var data3 = ["Player name", "Minutes", "FG%", "3P%", "FT%", "PPG", "APG", "RPG", "SPG", "BPG"]; //ADD TOV
  renderPara2(data3);
  var data = [], 
      id = x
  d3.select("#example").selectAll("svg").remove();

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=" + id, function(error, raw){
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
                raw[i].BLK/ raw[i].GP].map(function(d){
                                            if(!isNaN(d)){ 
                                              return parseFloat(d).toFixed(2);
                                            }
                                            else{return d;}}) }
  render()
});
var pc;

function render() {

  var color = d3.scale.linear().domain([10,20])
    .range(["#2eb4a6", "blue"])

  pc = d3.parcoords()("#example")
  
  .data(data)
  .render()
 
  .createAxes();

  pc.ctx.foreground.lineWidth = 2;
  pc.ctx.foreground.globalCompositeOperation = "darken";

  pc
    .smoothness(0.0) //REIMPLEMENT CURVATURE
    .alpha(0.3)
    .composite("darken")
    .rate(60)
    .margin({ top: 24, left: 65, bottom: 12, right: 0 })
    .autoscale()
    .color(function(d) {return color(d[1]);})
    .render()
    .brushMode("1D-axes")

    .reorderable(true);

//     d3.select("#smoothness").on("change", function() {
//     d3.select("#smooth").text(this.value);
//     pc.smoothness(this.value).render();
  //}
 // );

}



var grid = d3.divgrid(data3);
var data2 = [];

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=" + id, function(error, raw){
  

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
        pc.unhighlight;
        this.style.backgroundColor = null;
      }
    });

    pc.on("brush", function(d) {
    d3.select("#grid")
      .datum(d)
      .call(grid)
      .selectAll(".row")
      .on({
        "mouseover": function(d) { pc.highlight([d]) },
        "mouseout": pc.unhighlight
      });
   });   
});
}
