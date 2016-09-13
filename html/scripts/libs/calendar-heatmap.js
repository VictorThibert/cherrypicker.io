
function calendarHeatmap() {
  // defaults
  var width = 500;
  var height = 120;
  var legendWidth = 150;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August', 'September', '', 'Nov', 'Dec'];
  var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var selector = 'body';
  var SQUARE_LENGTH = 12;
  var SQUARE_PADDING = 2;
  var MONTH_LABEL_PADDING = 10;
			var now = moment("20150510", "YYYYMMDD").toDate();
			var yearAgo = moment("20141015", "YYYYMMDD").toDate()
  var data = [];
  var colorRange = ['#D8E6E7', '#218380'];
  var tooltipEnabled = true;
  var tooltipUnit = 'point';
  var legendEnabled = true;
  var onClick = null;

  // setters and getters
  chart.data = function (value) {
    if (!arguments.length) { return data; }
    data = value;
    return chart;
  };

  chart.selector = function (value) {
    if (!arguments.length) { return selector; }
    selector = value;
    return chart;
  };

  chart.colorRange = function (value) {
    if (!arguments.length) { return colorRange; }
    colorRange = value;
    return chart;
  };

  chart.tooltipEnabled = function (value) {
    if (!arguments.length) { return tooltipEnabled; }
    tooltipEnabled = value;
    return chart;
  };

  chart.tooltipUnit = function (value) {
    if (!arguments.length) { return tooltipUnit; }
    tooltipUnit = value;
    return chart;
  };

  chart.legendEnabled = function (value) {
    if (!arguments.length) { return legendEnabled; }
    legendEnabled = value;
    return chart;
  };

  chart.onClick = function (value) {
    if (!arguments.length) { return onClick(); }
    onClick = value;
    return chart;
  };

  function chart() {

    d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove(); // remove the existing chart, if it exists

    var dateRange = d3.time.days(yearAgo, now); // generates an array of date objects within the specified range
    var monthRange = d3.time.months(moment(yearAgo).startOf('month').toDate(), now); // it ignores the first month if the 1st date is after the start of the month
    var firstDate = moment(dateRange[0]);
    var max = d3.max(chart.data(), function (d) { return d.count; }); // max data value

    // color range
    var color = d3.scale.linear()
      .range(chart.colorRange())
      .domain([0, max]);

    var tooltip;
    var dayRects;

    drawChart();

    function drawChart() {
      var svg = d3.select(chart.selector())
        .append('svg')
        .attr('width', width)
        .attr('class', 'calendar-heatmap')
        .attr('height', height)
        .style('padding', '12px')
				.style('padding-left', "25px")

      dayRects = svg.selectAll('.day-cell')
        .data(dateRange);  //  array of days for the last yr

			var tooltip = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("position", "absolute")
				.style("top", 0)
				.style("left", 0)
				.style("opacity", 0);
			
      dayRects.enter().append('circle')
        .attr('class', 'day-cell')
        .attr('r', SQUARE_LENGTH/2.5)
//      .attr('height', SQUARE_LENGTH)
        .attr('fill', 'gray')
        .attr('cx', function (d, i) {
          var cellDate = moment(d);
          var result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
          return result * (SQUARE_LENGTH + SQUARE_PADDING) + 10;
        })
        .attr('cy', function (d, i) { return MONTH_LABEL_PADDING + d.getDay() * (SQUARE_LENGTH + SQUARE_PADDING) + 10; })
			.on("mouseover", function(d, i) {
				if(countForDate(d) > 0){
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
          tooltip.html(tooltipHTMLForDate(d))
               .style("left", (d3.event.pageX - 90) + "px")
               .style("top", (d3.event.pageY - 30) + "px");
				}
      })
			.on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

      if (typeof onClick === 'function') {
        dayRects.on('click', function (d) {
          var count = countForDate(d);
          onClick({ date: d, count: count});
        });
      }

//       if (chart.tooltipEnabled()) {
//         dayRects.on('mouseover', function (d, i) {
//           tooltip = d3.select(chart.selector())
//             .append('div')
//             .attr('class', 'day-cell-tooltip')
//             .html(tooltipHTMLForDate(d))
//             .style("left", (d3.event.pageX) + "px")
//             .style("top", (d3.event.pageY) + "px");
//         })
//         .on('mouseout', function (d, i) {
//           tooltip.remove();
//         });
//       }

//       if (chart.legendEnabled()) {
//         var colorRange = [color(0)];
//         for (var i = 3; i > 0; i--) {
//           colorRange.push(color(max / i));
//         }

//         var legendGroup = svg.append('g');
//         legendGroup.selectAll('.calendar-heatmap-legend')
//             .data(colorRange)
//             .enter()
//           .append('circle')
//             .attr('class', 'calendar-heatmap-legend')
//             .attr('r', SQUARE_LENGTH/2.5)
//             .attr('cx', function (d, i) { return (width - legendWidth) + (i + 1) * 13; })
//             .attr('cy', height + SQUARE_PADDING + 10)
//             .attr('fill', function (d) { return d; });

//         legendGroup.append('text')
//           .attr('class', 'calendar-heatmap-legend-text')
//           .attr('x', width - legendWidth - 13)
//           .attr('y', height + SQUARE_LENGTH)
//           .text('Less');

//         legendGroup.append('text')
//           .attr('class', 'calendar-heatmap-legend-text')
//           .attr('x', (width - legendWidth + SQUARE_PADDING) + (colorRange.length + 1) * 13)
//           .attr('y', height + SQUARE_LENGTH)
//           .text('More');
//       }

      dayRects.exit().remove();
      var monthLabels = svg.selectAll('.month')
          .data(monthRange)
          .enter().append('text')
          .attr('class', 'month-name')
          .style()
          .text(function (d) {
            return months[d.getMonth()];
          })
          .attr('x', function (d, i) {
            var matchIndex = 0;
            dateRange.find(function (element, index) {
              matchIndex = index;
              return moment(d).isSame(element, 'month') && moment(d).isSame(element, 'year');
            });
            return Math.floor(matchIndex / 7) * (SQUARE_LENGTH + SQUARE_PADDING) ;
          })
          .attr('y', "4px");  // fix these to the top

      days.forEach(function (day, index) {
        if (index % 2) {
          svg.append('text')
            .attr('class', 'day-initial')
            .attr('transform', 'translate(-8,' + (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1.5) + ')')
            .style('text-anchor', 'middle')
            .attr('dy', '2')
            .text(day);
        }
      });
    }

    function tooltipHTMLForDate(d) {
      var dateStr = moment(d).format('ddd, MMM Do YYYY');
      var matchup = matchupForDate(d);
      return '<span><strong>' + matchup + '</strong> on ' + dateStr + '</span>';
    }
		
		function matchupForDate(d) {
			var matchup = "N/A";
      var match = chart.data().find(function (element, index) {
        return moment(element.date).isSame(d, 'day');
      });
			if (match) {
        matchup = match.matchup;
      }
      return matchup;
		}

    function countForDate(d) {
      var count = 0;
      var match = chart.data().find(function (element, index) {
        return moment(element.date).isSame(d, 'day');
      });
      if (match) {
        count = match.count;
      }
      return count;
    }

    var daysOfChart = chart.data().map(function (day) {
      return day.date.toDateString();
    });

    dayRects.filter(function (d) {
      return daysOfChart.indexOf(d.toDateString()) > -1;
    }).attr('fill', function (d, i) {
      return color(chart.data()[i].count);
    });
  }

  return chart;
}


// polyfill for Array.find() method
/* jshint ignore:start */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
/* jshint ignore:end */
