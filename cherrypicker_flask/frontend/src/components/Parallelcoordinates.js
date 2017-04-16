/* eslint-disable */

import d3 from 'd3'
import parcoords from './Parcoords.js';

/* use the capsule format to pass in data from above react components */
let capsule = function(teamID = "1610612737"){

  let node = document.createElement('div');

  node.setAttribute("id", "parallel_coordinates");
  node.className="parcoords";
  node.style.height = "320px";
  node.style.width = "1070px";

  let headers = ["Player", "Minutes", "FG%", "3P%", "FT%", "PPG", "APG", "RPG", "SPG", "BPG"]; // add turnovers
  

  function generate_pc(div_id = "#parallel_coordinates", teamID = "1610612737"){

    d3.select(div_id).selectAll("canvas").remove()
    d3.select(div_id).selectAll("svg").remove();

    function load_data(){
      
      let data = loadJSON();
      
      
      
      console.log('data:', data)
      console.log('render data', render(data))  
      return render(data); // this may be needed to let data be loaded in first
      
      function loadJSON(filePath = "http://cherrypicker.io/php/getplayerbase.php?teamID=1610612737") {
        let json = loadTextFileAjaxSync(filePath, "application/json");
        let raw =  JSON.parse(json);
        let data = [];
        for(let i = 0; i < raw.length; i += 1){
          data[i] = [raw[i].PLAYER_NAME,
                      raw[i].MIN / raw[i].GP,
                      raw[i].FG_PCT,
                      raw[i].FG3_PCT,
                      raw[i].FT_PCT,
                      raw[i].PTS/ raw[i].GP,
                      raw[i].AST/ raw[i].GP,
                      raw[i].REB/ raw[i].GP,
                      raw[i].STL/ raw[i].GP, 
                      raw[i].BLK/ raw[i].GP]
          .map(function(d){
            if(!isNaN(d)){ 
              return parseFloat(d).toFixed(2);
            } else {
              return d;
            }
          })
        }
        return data;
      } 

      function loadTextFileAjaxSync(filePath, mimeType){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET",filePath,false);
        if (mimeType != null) {
          if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
          }
        }
        xmlhttp.send();
        if (xmlhttp.status==200){

          return xmlhttp.responseText;
        } else {
          return null;
        }
      }


     
    }
    
    function render(data) {
      let colorScale = d3.scale.linear().domain([2, 17, 30]).range(["#e76e5e","#f7e4ce","#4870ad"]);
      let pc = parcoords()('#' + node.getAttribute('id'))
        .data(data)
        .render()
        .createAxes()
        .hideAxis(["0"]);
      pc.ctx.foreground.lineWidth = 2;
      pc.ctx.foreground.globalCompositeOperation = "darken";

      pc.smoothness(0.1) //REIMPLEMENT CURVATURE
        .alpha(0.5)
        .composite("darken")
        .rate(60)
        .margin({ top: 30, left: 0, bottom: 10, right: 0})
        .autoscale()
        .color(function(d) {return colorScale(d[1]);})
        .brushMode("1D-axes")  
        .render()  
      return pc 
    }

    console.log('load_data',load_data())
    return load_data();
  }

  
  return {
    node: node, generate_pc: generate_pc()
  }

}


// let grid = divgrid(headers, pc);
// let data2 = [];

// d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=1610612737", function(error, raw){
//   for(let i = 0; i < raw.length; i += 1){
//     data2[i] = [raw[i].PLAYER_NAME, raw[i].MIN / raw[i].GP, raw[i].FG_PCT, raw[i].FG3_PCT, raw[i].FT_PCT, raw[i].PTS/ raw[i].GP, raw[i].AST/ raw[i].GP, raw[i].REB/ raw[i].GP, raw[i].STL/ raw[i].GP, raw[i].BLK/ raw[i].GP].map(function(d){if(!isNaN(d)){ return parseFloat(d).toFixed(2);}else{return d;}})
//   } 

// d3.select('#datagrid')
//   .datum(data2)
//   .call(grid)
//   .selectAll(".row")
//   .on({
//     "mouseover": function(d) { 
//       this.style.backgroundColor = "#EEE";
//       pc.highlight([d]); 
//     },
//     "mouseout": function(d) { 
//       pc.unhighlight([d]);
//       this.style.backgroundColor = null;},
//   });

//   pc.on("brush", function(d) {
//     d3.select("#datagrid")
//       .datum(d)
//       .call(grid)
//       .selectAll(".row")
//       .on({
//         "mouseover": function(d) {
//         this.style.backgroundColor = "#EEE";
//         pc.highlight([d]);  },
//         "mouseout": function(d) { 
//         pc.unhighlight([d]);
//        this.style.backgroundColor = null;}
      
//       });
//     })
// })

export default capsule

