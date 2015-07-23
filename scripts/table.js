var dataPlayers = [];

d3.json("http://cherrypicker.io/php/getplayerbase.php?teamID=1610612737", function(error, raw){

var dataPlayers = new Array(5);
for (var i = 0; i < 5; i++) {
    dataPlayers[i] = new Array(5);
    for (var j = 0; j < 5; j++) {
        if(i == 0){
            dataPlayers[i][j] = raw[j].PLAYER_NAME;
        }
        else if(i == 1){
            dataPlayers[i][j] = raw[j+5].PLAYER_NAME;
        }
        else if(i == 2){
            dataPlayers[i][j] = raw[j+10].PLAYER_NAME;
        }
        else{
            dataPlayers[i][j] = raw[raw.length - 1].PLAYER_NAME;
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
    for (i = 0; i < 4; i++) {
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
