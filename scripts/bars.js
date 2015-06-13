			var barWidth = 100,
	        	barHeight = 250,
	        	barPadding = 20;
	        	colors = d3.scale.category20();

	        var svgA = d3.select(".container-4").append("svg")
            	.attr("class", "barA")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

            var svgB = d3.select(".container-4").append("svg")
            	.attr("class", "barB")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

            var svgC = d3.select(".container-4").append("svg")
            	.attr("class", "barC")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

            var svgD = d3.select(".container-4").append("svg")
            	.attr("class", "barD")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

            var svgE = d3.select(".container-4").append("svg")
            	.attr("class", "barE")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

            var svgF = d3.select(".container-4").append("svg")
            	.attr("class", "barF")
            	.attr("width", barWidth)
            	.attr("height", barHeight);

				var dataA = [102.5,100.1],
				    dataB = [40.6,43.3],
				    dataC = [25.7,22.0],
				    dataD = [9.1,7.7],
				    dataE = [4.75,4.8],
				    dataF = [14.23,14.35],
				    dataScale = [0,120];

				var xScale = d3.scale.ordinal()
				            .domain(d3.range(dataA.length))
				            .rangeRoundBands([0, barWidth], 0.05);

				var yScale = d3.scale.linear()
				            .domain([0, d3.max(dataScale)])
				            .range([0, barHeight]);

				var xAxis = d3.svg.axis()
                  			.scale(xScale)
                  			.orient("bottom");           

				    svgA.selectAll("rect")
				        .data(dataA)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				    svgB.selectAll("rect")
				        .data(dataB)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				    svgC.selectAll("rect")
				        .data(dataC)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				        svgD.selectAll("rect")
				        .data(dataD)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				        svgE.selectAll("rect")
				        .data(dataE)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				        svgF.selectAll("rect")
				        .data(dataF)
				        .enter()
				        .append("rect")
				        .transition().duration(500).ease("linear")
				        .attr("x", function (d, i){
				            return xScale(i);
				        })
				        .attr("y", function (d){
				            return barHeight - yScale(d);
				        })
				        .attr("width", xScale.rangeBand())
				        .attr("height", function (d){
				            return yScale(d);
				        })
				        .attr("fill", function (d, i){
				            return colors(i);
				        })

				    	svgA.selectAll("text")
						   .data(dataA)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataA.length) + 13;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 113;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black");	

						svgB.selectAll("text")
						   .data(dataB)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataC.length) + 17;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 50;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black");

						svgC.selectAll("text")
						   .data(dataC)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataC.length) + 17;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 30;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black");

						svgD.selectAll("text")
						   .data(dataD)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataD.length) + 19;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 12;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black");	

						svgE.selectAll("text")
						   .data(dataE)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataE.length) + 18;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 8;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black");	

						svgF.selectAll("text")
						   .data(dataF)
						   .enter()
						   .append("text")	
						   .text(function (d){
						   	return d;
						   })
						   .attr("x", function (d, i) {
        					return i * (barWidth / dataF.length) + 14;
						   })
						   .attr("y", function (d) {
						        return barHeight - (d) - 18;
						   })
						   .attr("font-size", "9")
						   .attr("fill", "black"); 

						svgA.append("text")
						    .attr("class", "xLabel")
						    .attr("text-anchor", "middle")
						    .text("PPG"); 

						svgA.append("g")
							.attr("transform", "translate(0," + barHeight + ")")
						    .call(xAxis);     
