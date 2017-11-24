/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 4
*	scatterplot.js
*/

// run script when window is loaded
window.onload = function() {
        scatterplotDraw();
}

// initialize scatterplot
function scatterplotDraw() {
  // scale canvas dimensions
  var margin = {top: 80, right: 120, bottom: 50, left: 40},
                width = 1300 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

  // initiale the axes
  var x = d3.scale.linear()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height - 10, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // append continent colors
  var cValue = function(d) {return d.continent;};
      color = d3.scale.category10();    

  // initialize svg element
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // initialize tooltip in to body    
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);    

  // load json dataset
  d3.json("dataset.json", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.co2 = +d.co2;
      d.energyUse = +d.energyUse;
    });

    x.domain(d3.extent(data, function(d) { return d.energyUse; })).nice();
    y.domain(d3.extent(data, function(d) { return d.co2; })).nice();

    // append title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Scatterplot CO2 emissions X Energy Use 2010");

    // append subtitle
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 4))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Source: www.gapminder.org");

    // append x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", - 6)
        .style("text-anchor", "end")
        .text("Energy Use (tonnes of oil equivalent)");

    // append y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", + 6 )
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("CO2 emissions (tonnes per person)");

    // append dots in canvas
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return (Math.pow(d.population, 1 / 4)) / 7;})
        .attr("cx", function(d) { return x(d.energyUse); })
        .attr("cy", function(d) { return y(d.co2); })
        .style("fill", function(d) { return color(cValue(d));})
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html("Country: " + d.country + "<br/>" + "Energy Use: " + 
                          d.energyUse + "<br/>" + "CO2: " + d.co2 + "<br/>" +
                          "Population: " + d.population + "<br/>" +
                          "Continent: " + d.continent)         
                 .style("font-size", "10px")
                 .style("font-family", "sans-serif")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 20)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "begin")
        .text(function(d) { return d; });

  });
}