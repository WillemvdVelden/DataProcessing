/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 3
*	barchart.js
*/

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width);

// load the data
d3.json("dataset.json", function(error, data) {
	console.log(typeof(data[0]['rain']));
	x.domain([0, d3.max(data, function(d) { return d.rain; })]);

	chart.attr("height", barHeight * data.length);

	var bar = chart.selectAll("g")
	  .data(data)
	  .enter().append("g")
	  .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
	  .attr("width", function(d) { return x(d.rain); })
	  .attr("height", barHeight - 1);

	bar.append("text")
	  .attr("x", function(d) { return x(d.rain) - 3; })
	  .attr("y", barHeight / 2)
	  .attr("dy", ".35em")
	  .text(function(d) { return d.rain; });
});