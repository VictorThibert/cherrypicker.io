var jqxhr;
$.getJSON("../data/2014-2015rosters.json", function(data) {
    jqxhr = data;
});

function loadRoster(RcurrentTeam, RcurrentYear, isNewTeam){

  		
  var shiftedTeam = RcurrentTeam - 37;
  var teamJSON = jqxhr.teams[shiftedTeam];
  
  
 

  

  
  //FILL ROSTER UPON GIVEN TEAM MEMBERS
  if(!isNewTeam){
    var tempSelectedPlayers = location.hash.slice(9).split("+");
//     console.log("GIVEN: " + tempSelectedPlayers);
    
    for(i = 0; i <= 14; i+=1){
      var $parent = $( "#Roster" + (i + 1) );	
      var $text = $parent.find('text');//SELECTS THE td ELEMENT
      $text.text( "" + teamJSON.roster[i].playerName); //FILLS ALL TEXT REGARDLESS OF GIVEN PLAYER
      $parent.find('a.neutral').toggleClass("down", false);
      $parent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $parent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);
    
      //might have to surround this with an  if for a reload
      if(tempSelectedPlayers.indexOf(teamJSON.roster[i].playerID) == -1){
      
      
//   
//         console.log(teamJSON.roster[i].playerID + " not present")
        $parent.find('a.neutral').toggleClass("down", true);
      }  //This is how you deselect buttons from the URL
   }
    
 }
  
 
  //FILLING ROSTER TEXT UPON NEW TEAM
  if(isNewTeam){ 
    $('a').toggleClass("down", false); ////SETS ALL BOXES GREEN
//     console.log("LOADING FULL ROSTER BY PUSH")
    for(i = 0; i <= 14; i+=1){

      var $parent = $( "#Roster" + (i + 1) );	//SELECTS THE td ELEMENT

      if(teamJSON.roster[i] === undefined || teamJSON.roster[i].playerName == "N/A"){
        $parent.hide(); //slide for the haha
        continue;
      } else {  
        $parent.show(); 
      }//REMOVE CELL FROM ROW

      var $text = $parent.find('text');

      $text.text( "" + teamJSON.roster[i].playerName);

      selectedPlayers.push(teamJSON.roster[i].playerID);

      //SET ALL THE DATA-PLAYER ATTRIBUTES TO RESPECTIVE TEAM
      $parent[0].childNodes[0].setAttribute("data-player", teamJSON.roster[i].playerName);
      $parent[0].childNodes[0].setAttribute("data-playerID", teamJSON.roster[i].playerID);

    }  

  }
 


  
  
  
}