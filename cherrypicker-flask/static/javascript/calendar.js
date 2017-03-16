
function renderCalendar(teamID, year) {


  //send the teamID to python script
  // function postData(input) {
  //   $.ajax({
  //       type: "POST",
  //       url: "./python/python_get_mysql/get_calendar.py",
  //       data: { param: input },
  //       success: callbackFunc
  //   });
  // }

  // function callbackFunc(response) {
  //   console.log(response);
  // }

  // postData('data to process');


  d3.json("http://cherrypicker.io/php/getcalendar.php?teamID=16106127" + teamID, function(error, raw) {
    var gameDates = [];
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].HOME_TEAM_ID == "16106127" + teamID){
        gameDates[i] = [moment(raw[i].GAME_DATE_EST, "YYYYMMDD").toDate(), raw[i].MATCHUP, raw[i].GAME_ID, raw[i].HOME_POINTS - raw[i].AWAY_POINTS];
      }
      else if(raw[i].HOME_TEAM_ID != "16106127" + teamID){
gameDates[i] = [moment(raw[i].GAME_DATE_EST, "YYYYMMDD").toDate(), raw[i].MATCHUP, raw[i].GAME_ID, raw[i].AWAY_POINTS - raw[i].HOME_POINTS];
      }
      
      //gameDates[i] = [moment(raw[i].GAME_DATE_EST, "YYYYMMDD").toDate(), raw[i].MATCHUP, raw[i].GAME_ID, raw[i].HOME_POINTS - raw[i].AWAY_POINTS];
    }
    gameDates.sort(sorter)
    
    function sorter(a, b){
      return moment(a[0]).diff(moment(b[0]))
    }
    
    var now = moment("20150510", "YYYYMMDD").toDate();
    var yearAgo = moment("20141015", "YYYYMMDD").toDate()
    
    var allDays = d3.time.days(yearAgo, now);
    var temp = 0;
    var chartData = d3.time.days(yearAgo, now).map(function(dateElement) {
      for (var i = temp; i < gameDates.length; i++) {
   
        if (temp == 81 ) {
           return {
            date: dateElement,
            count: 0
          }
        }
        else if (String(dateElement) == gameDates[i][0]) {
          
          temp++;
          return {
            date: dateElement,
            count: gameDates[i][3], // test with different gradients
            matchup: gameDates[i][1],
            gameid: gameDates[i][2],
            scoreString: gameDates[i][3]
          }
        } else {
          return {
            date: dateElement,
            count: 0,
            matchup: "N/A"
          }
        }
      }
      
    
    });
    
    var heatmap = calendarHeatmap()
      .data(chartData)
      .selector('#calendar')
      .tooltipEnabled(true)
      .colorRange(['#f4f7f7', '#6e8fb7'])
      .onClick(function(data) {
        if(data.count == 10){
          console.log('data', data);
        }
      });
    heatmap(); // render the chart
  });
}