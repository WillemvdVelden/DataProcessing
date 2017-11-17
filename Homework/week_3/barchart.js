/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 3
*	barchart.js
*/

var margin = {top: 40, right: 30, bottom: 30, left: 40},
	width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom; 

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);   

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");     

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width)
    .ticks(5);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Celcius:</strong> <span style='color:red'>" + d.temperature+ "</span>";
  })    

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

// load the data
d3.json("dataset.json", function(error, data) { data.forEach(function(d) {
	d.date = d.date;
	d.temperature =+ d.temperature / 10;
});
	x.domain(data.map(function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

	chart.append("text")
	  .attr("x", (width / 2))
	  .attr("y", 0 - (margin.top / 2))
	  .attr("text-anchor", "middle")
	  .style("font-size", "20px")
	  .text("Average temperature October 2017 in De Bilt");

  	chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", width)
      .attr("dy", "2.9em")
      .style("text-anchor", "end")
      .text("Days");

  	chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature")

  	chart.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.temperature); })
      .attr("height", function(d) { return height - y(d.temperature); })
      .attr("width", x.rangeBand())
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});