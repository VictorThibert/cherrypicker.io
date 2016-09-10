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
