/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 3
*	barchart.js
*/

var width = 960,
    height = 500

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

// load the data
d3.json("dataset.json", function(error, data) {
	console.log(data);
	y.domain([0, d3.max(data, function(d) { return d.rain; })]);

	var barWidth = width / data.length

	var bar = chart.selectAll("g")
	  .data(data)
	  .enter().append("g")
	  .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
	  .attr("y", function(d) { return y(d.rain); })
	  .attr("height", function(d) { return height - y(d.rain); })
      .attr("width", barWidth - 1);

	bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.rain) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.rain; });
});
