var dataPlayers = [];

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=1610612737", function(error, raw){
  var i = 0;
  for(i = 0; i < raw.length; i += 1){
    for (j = i; j < raw.length; j +=1){
      for (k = i + 1; k < raw.length; k += 1){
    dataPlayers[i] = [
    [raw[i].PLAYER_NAME],
    [raw[j].PLAYER_NAME],
    [raw[k].PLAYER_NAME]];
        }  
      }   
    }
    console.log(dataPlayers);
    printTable(dataPlayers);
});

//function sortPlayers(players){

//}

//function printTable(players){
//  for (var i = 0; i < players.length; i++) {
//    document.write("<td>" + players[i] + "</td></tr>");
//  }
//};

function printTable(players) {
    var myTableDiv = document.getElementById("hiddenbar")
    var table = document.createElement('TABLE')
    var tableBody = document.createElement('TBODY')

    table.border = '1'
    table.appendChild(tableBody);

    var heading = new Array();
    heading[0] = "Point Guard"
    heading[1] = "Shooting Guard"
    heading[2] = "Small Forward"
    heading[3] = "Power Forward"
    heading[4] = "Center"

    //TABLE COLUMNS
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (i = 0; i < 5; i++) {
        var th = document.createElement('TH')
        th.width = '75';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }

    //TABLE ROWS
    for (i = 0; i < 5; i++) {
        var tr = document.createElement('TR');
        for (j = 0; j < 5; j++) {
            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(players[i][j]));
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }  
    myTableDiv.appendChild(table)
}