/**
*   Willem van der Velden
*   Minor Programmeren Fall 2017
*   Data Processing
*   Week 5
*   multigraph.js
*/

// run script when window is loaded
window.onload = function() {
        multigraphDraw();
}

var margin = {top: 50, right: 70, bottom: 50, left: 70},
                  width = 1200 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

var dataset = "datasetSchiphol.json";

function Schiphol () {
	d3.select("svg").remove();
	dataset = "datasetSchiphol.json";
	multigraphDraw();
}    

function HoekvanHolland () {
	d3.select("svg").remove();
	dataset = "datasetHoekHolland.json";
	multigraphDraw();
}                 

// draw graph
function multigraphDraw() {
    
    // change date to js format
    var parseTime = d3.timeParse("%y-%m-%d");
    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    // set the ranges
    var xScale = d3.scaleTime().rangeRound([0, width]);
    var yScale = d3.scaleLinear().rangeRound([height, 0]);

    // define the maximum line
    var maximumLine = d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.maximum); });
    
    // define the minimum line
    var minimumLine = d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.minimum); });

    // define the average line    
    var averageLine = d3.line()
        .curve(d3.curveCatmullRom)
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.average); });

    // append svg object
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Get the data
    d3.json(dataset, function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
          d.date = parseTime(d.date.slice(2, 4) + "-" + 
                   d.date.slice(4, 6) + "-" + d.date.slice(6, 8));
          d.minimum = +d.minimum / 10;
          d.maximum = +d.maximum / 10;
          d.average = +d.average / 10;
        });

        // scale the range of the data
        xScale.domain(d3.extent(data, function(d) { return d.date; }));
        
        yScale.domain([
            (d3.min(d3.extent(data, function(d) { return d.minimum; })) - 1),
            (d3.max(d3.extent(data, function(d) { return d.maximum; })) + 1)
        ]);

        // add the X Axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .append("text")
          .attr("fill", "#000")
          .attr("y", 30)
          .attr("x", width)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Dates");

        // add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(yScale))
          .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Temperature (°C)");

        // append maximum temp line
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", maximumLine)
            .style("stroke", "darkred");

        // append average temp line
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", averageLine)
            .style("stroke", "lightgreen");
        
        // append average temp line         
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", minimumLine)
            .style("stroke", "deepskyblue");

        // crosshair
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x_hover_line hover-line")   
            .attr("y2", height)

        // append circles in crosshair
        var circles = focus.selectAll("circle")
            .data(["maximum", "minimum", "average"])
            .enter().append("circle")
            .attr("r", 4);

        var lines = focus.selectAll(".focuslines")
            .data(["maximum", "minimum", "average"])
            .enter().append("line")
            .attr("class", "y_hover_line hover-line")
            .attr("x1", 0)

        // add data to 
        focus.selectAll("text")
            .data(["maximum", "minimum", "average"])
            .enter().append("text")
            .attr("class", "crosshair_text")
            .attr("font-size", "10px")
            .attr("font-family", "sans-serif")
            .attr("dy", ".31em");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        // when hover on graph, create crosshair
        function mousemove() {
            var x0 = xScale.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus.selectAll("circle")
                .data(["maximum", "minimum", "average"])
                .attr("cy", function(h) { return yScale(d[h])})
                .attr("cx", function() { return xScale(d.date)})
                .style("fill", "none")

            focus.select(".x_hover_line")
                .attr("y1", yScale(d.maximum))
                .attr("y2", height)
                .attr("x1", xScale(d.date))
                .attr("x2", xScale(d.date));

            focus.selectAll(".crosshair_text")
                .data(["maximum", "minimum", "average"])
                .attr("x", function() { return xScale(d.date) + 7})
                .attr("y", function(h) { return yScale(d[h]) - 7})
                .text(function(h) { return d[h]});
        }           

        // create legend
        var legend = svg.selectAll(".legend")
            .data(["maximum", "minimum", "average"])
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        svg.append('rect')
			.attr("x", width - 30)
			.attr("y", 4)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", "darkred");
	
		svg.append('rect')
			.attr("x", width - 30)
			.attr("y", 23)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", "deepskyblue");
	
		svg.append('rect')
			.attr("x", width - 30)
			.attr("y", 44)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", "lightgreen");

        legend.append("text")
            .attr("x", width - 10)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "begin")
            .text(function(d) { return d; });

        // append title
        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .text("Multiline graph weatherdata Schiphol and Hoek van Holland November 2016");

        // append subtitle
        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 10))
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .text("Source: www.knmi.nl");

         // append subtitle
        svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top - 65))
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .text("Willem van der Velden | 10546324");          
    });
}








