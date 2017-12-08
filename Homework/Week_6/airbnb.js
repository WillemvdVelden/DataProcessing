/**
*   Willem van der Velden
*   Minor Programmeren Fall 2017
*   Data Processing
*   Week 6
*   linkedviews.js
*/
// run script when window is loaded
window.onload = function() {
        run();
}

function run () {
	var q = d3_queue.queue(3)
	.defer(d3.json, 'amsterdam.geojson')
	.defer(d3.json, 'listingsCount.json')
	.defer(d3.csv, 'reviewCount.csv')
	.awaitAll(draw);

	function draw(error, data) {

    // important: First argument it expects is error
    if (error) throw error;
      
    /*
    D3.js setup code
    */

    var margin = 50,
        width = 450 - margin,
        height = 500 - margin;
    
    var format = d3.time.format("%Y-%m-%d");

    // create a projection properly scaled for SF
    var projection = d3.geo.mercator()
                      .center([4.8952, 52.3702])
                      .scale(80000)
                      .translate([width / 2, height / 2]);
    
    // create a path to draw the neighborhoods
    var path = d3.geo.path()
                     .projection(projection);

    // create and append the map of SF neighborhoods
    var map = d3.select('#map').selectAll('path')
                 .data(data[0].features)
                 .enter()
                 .append('path')
                 .attr('d', path)
                 .style('fill', '#fd5c63')
                 .style('stroke', 'black')
                 .style('stroke-width', 1);  

    // normalize neighborhood names
    map.datum(function(d) {
      var normalized = d.properties.neighbourhood
                        .replace(/ /g, '_')
                        .replace(/\//g, '_');

      d.properties.neighbourhood = normalized;
      return d;
    });             

    // add the neighborhood name as its class
    map.attr('class', function(d) {
                    return d.properties.neighbourhood;
                 });        

    // find the min/max of listing per neighborhood
    var listings_extent = d3.extent(d3.values(data[1]));

	// append a bubble to each neighborhood
	var bubbles = d3.select('#map').append("g")
	     .attr("class", "bubble")
	     .selectAll("circle")
	     .data(data[0].features)
	     .enter()
	     .append("circle")
	     .attr('class', 'airbnb');

	// add the listing data to each neighborhood datum
	bubbles.datum(function(d) {
		d.count = data[1][d.properties.neighbourhood];
		return d;
	});

	// scale each bubble with a sqrt scale
	var radius = d3.scale.pow().exponent(0.5)
	             .domain(listings_extent)
	             .range([3, 12]);

	// transform each bubbles' attributes according to the data 
	bubbles
	 .attr("cx", function(d) { return path.centroid(d.geometry)[0]; })
	 .attr("cy", function(d) { return path.centroid(d.geometry)[1]; })
	 .attr("r", function(d) { return radius(d.count); });

	var field = "De Baarsjes - Oud-West"

	// maximum reviews
    var max_y = d3.max(data[2], function(d) {
        var max = 0;

        d3.values(d).forEach(function(i) {
          if (+i && (+i > max)) {
            max = +i;
          }
        });

        return max;
    });

	// Create y-axis scale mapping price -> pixels
    var measure_scale = d3.scale.linear()
        .range([height, 100])
        .domain([0, max_y]);

    // Create D3 axis object from measure_scale for the y-axis
    var measure_axis = d3.svg.axis()
        .scale(measure_scale)
        .orient("right");

    // Append SVG to page corresponding to the D3 y-axis
    d3.select('#chart').append('g')
          .attr('class', 'y axis')
          .attr("transform", "translate(" + width + " , -15)")
          .call(measure_axis);

    // add label to y-axis
    d3.select(".y.axis")
          .append("text")
          .attr('class', 'label')
          .text("Reviews per week")
          .attr("transform", "translate(45,215) rotate(90)");    

    // create a function to draw the timeseries for each neighborhood
    var drawChart = function(field) {
		// remove the previous chart
		d3.select('#chart').select('.x.axis').remove();
		d3.select('#chart').select('path').remove();

		// update the title
		d3.select('#heading')
			.text(field.replace(/_/g, ' '));

		// update the title
		d3.select('#amount')
			.text("Amount of Airbnb's: " + data[1][field.replace(/ /g, '_')
                        	   							.replace(/\//g, '_')]);

		// remove missing values
		var neigh_data = data[2].filter(function(d) {
			return d[field];
		});

		// get min/max dates
		var time_extent = d3.extent(neigh_data, function(d){
			return format.parse(d['timestamp']);
		});

		// Create x-axis scale mapping dates -> pixels
		var time_scale = d3.time.scale()
			.range([0, width - margin])
			.domain(time_extent);

		// Create D3 axis object from time_scale for the x-axis
		var time_axis = d3.svg.axis()
			.scale(time_scale)
			.tickFormat(d3.time.format("%b '%y"));

		// Append SVG to page corresponding to the D3 x-axis
		d3.select('#chart').append('g')
			.attr('class', 'x axis')
			.attr('transform', "translate(" + margin + ',' + (height - 15) + ")")
			.call(time_axis)
			  .selectAll("text")
			.attr("y", 0)
			.attr("x", 9)
			.attr("dy", ".35em")
			.attr("transform", "rotate(90)")
			.style("text-anchor", "start");

		// define the values to map for x and y position of the line
		var line = d3.svg.line()
		       .x(function(d) { return time_scale(format.parse(d['timestamp'])); })
		       .y(function(d) { return measure_scale(+d[field]); });

		// append a SVG path that corresponds to the line chart
		d3.select('#chart').append("path")
		.datum(neigh_data)
		.attr("class", "line")
		.attr("d", line)
		.attr('transform', 'translate(' + margin + ', -15)');
	};

    drawChart(field);

	// create a callback for the neighborhood hover
	var mover = function(d) {
		var neigh = d.properties.neighbourhood;
		d3.select('#map path.' + neigh).style('fill', 'black');

		drawChart(neigh);
	};

	// create a callback for the neighborhood hover
	var mout = function(d) {
	var neigh = d.properties.neighbourhood;
		d3.select('path.' + neigh).style('fill', '#fd5c63');
	}

	// attach events to neighborhoods in map
	map.on("mouseover", mover);
	map.on("mouseout", mout);

	// attach events to bubbles on map
	bubbles.on('mouseover', mover);
	bubbles.on('mouseout', mout);
	};

}
