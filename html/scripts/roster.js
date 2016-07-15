var jqxhr;
var shiftedTeam;
var teamJSON;
var tempSelectedPlayers;
var rosterTooltip = [];
var $parent;
var rosterArray = [];
var rosterArrayCount = 0;

$.getJSON("../data/2014-2015rosters.json", function(data) {
    jqxhr = data;
});

function loadRoster(RcurrentTeam, RcurrentYear, isNewTeam){

  shiftedTeam = RcurrentTeam - 37;
  teamJSON = jqxhr.teams[shiftedTeam];

  //FILL ROSTER UPON GIVEN TEAM MEMBERS
  if(!isNewTeam){
    tempSelectedPlayers = location.hash.slice(9).split("+");
  
    for(i = 0; i <= 14; i+=1){
      var $parent = $( "#Roster" + (i + 1) );
      rosterArray[i] = $parent;
      //var playerName = teamJSON.roster[i].playerName;
      
      if(teamJSON.roster[i].playerName == "N/A"){
        $parent.hide(); 
        continue;
      } else {  
        $parent.show(); 
      }//REMOVE CELL FROM ROW
      
      var $text = $parent.find('text');//SELECTS THE td ELEMENT
      $text.text( "" + teamJSON.roster[i].playerName); //FILLS ALL TEXT REGARDLESS OF GIVEN PLAYER
      $parent.find('a.neutral').toggleClass("down", false);
      $parent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $parent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);
    
      //might have to surround this with an  if for a reload
      if(tempSelectedPlayers.indexOf(teamJSON.roster[i].playerID) == -1){
        $parent.find('a.neutral').toggleClass("down", true);
      }  //This is how you deselect buttons from the URL
      rosterArrayCount++;
    }  
 }
 
  //FILLING ROSTER TEXT UPON NEW TEAM
  if(isNewTeam){ 
    $('a').toggleClass("down", false); ////SETS ALL BOXES GREEN

    for(i = 0; i <= 14; i+=1){

      var $parent = $( "#Roster" + (i + 1) );	//SELECTS THE td ELEMENT

      if( i % 3 !== 0){ //MAKES NON STARTERS GREY
         $parent.find('a.neutral').toggleClass("down", true);
      }
      if(teamJSON.roster[i].playerName == "N/A"){
        $parent.hide(); //slide for the haha
        continue;
      } else {  
        $parent.show(); 
      }//REMOVE CELL FROM ROW

      var $text = $parent.find('text');
      $text.text( "" + teamJSON.roster[i].playerName);

      if( i % 3 === 0){ //MAKES NON STARTERS GREY
         selectedPlayers.push(teamJSON.roster[i].playerID);
      }
       
      //SET ALL THE DATA-PLAYER ATTRIBUTES TO RESPECTIVE TEAM
      $parent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $parent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);

    }  
  } 
  drawTooltips();
}

function drawTooltips(){
  console.log("bjhbd");
  for(i = 0; i < rosterArrayCount; i++){
    console.log(rosterArray[i]);
    var playerName = teamJSON.roster[i].playerName;

   rosterArray[i].mouseenter(function(){
          rosterArray[i].append('<div id="tooltip' + i + '">Hello</div>');  
          rosterTooltip = $('#tooltip' + i);
          rosterTooltip
            .css("width", "100")
            .css("height", "300")
            .css("position", "absolute")
            .css("top", rosterArray[i].position().top + 20 + "px")
            .css("left", rosterArray[i].position().left + 20 + "px")
            .css("background-color", "red")
            .css("z-index", "10000")
            .text(playerName)
          ;
        })
        .mouseleave(function(){
          rosterTooltip.remove();
        });
  }
}
