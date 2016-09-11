/*
var now = moment().endOf('day').toDate();
var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
var chartData = d3.time.days(yearAgo, now).map(function(dateElement) {
  return {
    date: dateElement,
    count: (dateElement.getDay() !== 0 && dateElement.getDay() !== 6) ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 10)
  };
});

console.log(yearAgo);
console.log(now);

function renderCalendar() {
  var calendar = calendarHeatmap()
    .data(chartData)
    .selector('#calendar')
    .colorRange(['#D8E6E7', '#218380'])
    .tooltipEnabled(true)
  ;
  
  calendar();
}

renderCalendar();*/

function renderCalendar(teamID) {

  d3.json("http://cherrypicker.io/php/getcalendar.php?teamID=16106127" + teamID, function(error, raw) {
    var gameDates = [];
    for (var i = 0; i < raw.length; i++) {
      gameDates[i] = moment(raw[i].GAME_DATE_EST, "YYYYMMDD").toDate();
    }
    gameDates.sort(sorter)
    
    function sorter(a, b){
      return moment(a).diff(moment(b))
    }
    
    console.log(gameDates[44])
    var now = moment("20150601", "YYYYMMDD").toDate();
    var yearAgo = moment("20141001", "YYYYMMDD").toDate()
    
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
        else if (String(dateElement) == gameDates[i]) {
          
          temp++;
          return {
            date: dateElement,
            count: 10
          }
        } else {
          return {
            date: dateElement,
            count: 0
          }
        }
      }
      
    
    });
    
    var heatmap = calendarHeatmap()
      .data(chartData)
      .selector('#calendar')
      .tooltipEnabled(true)
      .colorRange(['#f4f7f7', '#79a8a9'])
      .onClick(function(data) {
        console.log('data', data);
      });
    heatmap(); // render the chart
  });
}