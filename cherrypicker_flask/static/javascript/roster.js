var jqxhr;
var shiftedTeam;
var teamJSON;
var tempSelectedPlayers;
var rosterTooltip;
var $parent;

// data folder is to be deprecated soon
$.getJSON("./static/data/2014-2015rosters.json", function(data) {
    jqxhr = data;
});

function loadRoster(RcurrentTeam, RcurrentYear, isNewTeam){
  shiftedTeam = RcurrentTeam - 37;
  teamJSON = jqxhr.teams[shiftedTeam];

  if(!isNewTeam){ //FILL ROSTER UPON GIVEN TEAM MEMBERS
    tempSelectedPlayers = location.hash.slice(9).split("+"); //takes the players from the url
  
    for(i = 0; i <= 14; i+=1){
      var $parent = $( "#Roster" + (i + 1) );
      var $targetParent = $( "#Roster" + (1));
      
      if(teamJSON.roster[i].playerName == "N/A"){
        $parent.hide(); 
        continue;
      } 
      else {  
        $parent.show(); 
      }
      
      
      // $parent.mouseenter(function(){
      //   var toolTipName = $(this).text();
      //   //var playerId = $parent[i].getAttribute("data-playerID");
      //   console.log(playerId);
      //   $(this).append('<div id="tooltip"></div>');  
      //       rosterTooltip = $('#tooltip');
      //       rosterTooltip
      //         .css("width", "300")
      //         .css("height", "191")
      //         .css("position", "absolute")
      //         .css("top", $targetParent.position().top + "px")
      //         .css("left", $targetParent.position().left - 305 + "px")
      //         .css("background-color", "rgba(255,255,255, 0.8)")
      //         .css("border", "1px solid #33bdb1")
      //         .css("border-radius", "6px")
      //         //.css("opacity", "0.7")
      //       ;
      //     rosterTooltip.append('<div id="playerName"></div>');
      //     playerNameLabel = $('#playerName')
      //     playerNameLabel
      //       .css("position", "relative")
      //       .css("margin", "auto")
      //       .css("padding-top", "10px")
      //       .text(toolTipName)
      //     ;
      // })
      // .mouseleave(function(){
      //   rosterTooltip.remove();
      //   playerNameLabel.remove();
      // })
            
      
      var $text = $parent.find('text'); //SELECTS THE td ELEMENT
      $text.text( "" + teamJSON.roster[i].playerName); //FILLS ALL TEXT REGARDLESS OF GIVEN PLAYER
      $parent.find('a.neutral').toggleClass("down", false);
      $parent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $parent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);
    
      //might have to surround this with an  if for a reload
      if(tempSelectedPlayers.indexOf(teamJSON.roster[i].playerID) == -1){
        $parent.find('a.neutral').toggleClass("down", true);
      }  //This is how you deselect buttons from the URL
    }  
 }
    
  if(isNewTeam){ //FILLING ROSTER TEXT UPON NEW TEAM
    $('a').toggleClass("down", false); ////SETS ALL BOXES GREEN

    for(i = 0; i <= 14; i+=1){
      var $newTeamParent = $( "#Roster" + (i + 1) );	//SELECTS THE td ELEMENT
      //var $newPlayerName = teamJSON.roster[i].playerName;
      var $targetParentNew = $( "#Roster" + (1));
      
      if( i % 3 !== 0){ //MAKES NON STARTERS GREY
         $newTeamParent.find('a.neutral').toggleClass("down", true);
      }
      if(teamJSON.roster[i].playerName == "N/A"){
        $newTeamParent.hide();
        continue;
      } 
      else {  
        $newTeamParent.show(); 
      }//REMOVE CELL FROM ROW

      var $newTeamText = $newTeamParent.find('text');
      $newTeamText.text( "" + teamJSON.roster[i].playerName);

       
      // $newTeamParent.mouseenter(function(){
      //   var tooltipNameNew = $(this).text();
      //   console.log("werwe");
      //   $(this).append('<div id="tooltip"></div>');  
      //       rosterTooltip = $('#tooltip');
      //       rosterTooltip
      //         .css("width", "300")
      //         .css("height", "191")
      //         .css("position", "absolute")
      //         .css("top", $targetParentNew.position().top + "px")
      //         .css("left", $targetParentNew.position().left - 305 + "px")
      //         .css("background-color", "rgba(255,255,255, 0.8)")
      //         .css("border", "1px solid #33bdb1")
      //         .css("border-radius", "6px")
      //         //.css("opacity", "0.7")
      //       ;
      //     rosterTooltip.append('<div id="playerName"></div>');
      //     playerNameLabel = $('#playerName')
      //     playerNameLabel
      //       .css("position", "relative")
      //       .css("margin", "auto")
      //       .css("padding-top", "10px")
      //       .text(tooltipNameNew)
      //     ;
      // })
      // .mouseleave(function(){
      //   rosterTooltip.remove();
      // })
      
      
      if( i % 3 === 0){ //MAKES NON STARTERS GREY
         selectedPlayers.push(teamJSON.roster[i].playerID);
      }
       
      //SET ALL THE DATA-PLAYER ATTRIBUTES TO RESPECTIVE TEAM
      $newTeamParent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $newTeamParent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);

    }
  }
}


// function drawTooltip(){
//      $(this).mouseenter(function(){
//             rosterArray[i].append('<div id="tooltip' + i + '"></div>');  
//             rosterTooltip = $('#tooltip' + i);
//             rosterTooltip
//               .css("width", "100")
//               .css("height", "300")
//               .css("position", "absolute")
//               .css("top", rosterArray[i].position().top + 20 + "px")
//               .css("left", rosterArray[i].position().left + 20 + "px")
//               .css("background-color", "red")
//               .css("z-index", "10000")
//               .text(playerName)
//             ;
//           })
//           .mouseleave(function(){
//             rosterTooltip.remove();
//           });
//     }
// }
