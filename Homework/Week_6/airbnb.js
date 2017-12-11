/**
*   Willem van der Velden
*   Minor Programmeren Fall 2017
*   Data Processing
*   Week 6
*   airbnb.js
*/

// run script when window is loaded
window.onload = function() {
        run();
}

// run code after window in loaded
function run () {

	// use queue to load all files
	var q = d3_queue.queue(3)
	.defer(d3.json, '/data/amsterdam.geojson')
	.defer(d3.json, '/data/listingsCount.json')
	.defer(d3.csv, '/data/reviewCount.csv')
	.awaitAll(draw);

	// function for drawing canvas and Amsterdam map
	function draw(error, data) {
    if (error) throw error;

    // give canvas specs
    var margin = 50,
        width = 450 - margin,
        height = 500 - margin;
    
    // format reviewCount file a javascript time format
    var format = d3.time.format("%Y-%m-%d");

    // scale projection for Amsterdam map
    var projection = d3.geo.mercator()
                      .center([4.8952, 52.3702])
                      .scale(80000)
                      .translate([width / 2, height / 2]);
    
    // create a path to draw the neighbourhoods
    var path = d3.geo.path()
                     .projection(projection);

    // append neighbourhood to canvas
    var map = d3.select('#map').selectAll('path')
                 .data(data[0].features)
                 .enter()
                 .append('path')
                 .attr('d', path)
                 .style('fill', '#fd5c63')
                 .style('stroke', 'black')
                 .style('stroke-width', 1);  

    // change neighbourhood names 
    map.datum(function(d) {
      var change= d.properties.neighbourhood
                        .replace(/ /g, '_')
                        .replace(/\//g, '_');

      d.properties.neighbourhood = change;
      return d;
    });             

    // use neighbourhood name as class
    map.attr('class', function(d) {
                    return d.properties.neighbourhood;
                 });        

    // get listings per neigbourhood
    var listings = d3.extent(d3.values(data[1]));

	// append bubbles to map
	var bubbles = d3.select('#map').append("g")
	     .attr("class", "bubble")
	     .selectAll("circle")
	     .data(data[0].features)
	     .enter()
	     .append("circle")
	     .attr('class', 'airbnb');

	// add listing data to bubble
	bubbles.datum(function(d) {
		d.count = data[1][d.properties.neighbourhood];
		return d;
	});

	// scale bubbles by root
	var radius = d3.scale.pow().exponent(0.5)
	             .domain(listings)
	             .range([3, 12]);

	// give specs to bubbles
	bubbles
	 .attr("cx", function(d) { return path.centroid(d.geometry)[0]; })
	 .attr("cy", function(d) { return path.centroid(d.geometry)[1]; })
	 .attr("r", function(d) { return radius(d.count); });

	// default neighbourhood 
	var field = "De Baarsjes - Oud-West"

	// get maximum reviews for graph
    var maxY = d3.max(data[2], function(d) {
        var max = 0;

        d3.values(d).forEach(function(i) {
          if (+i && (+i > max)) {
            max = +i;
          }
        });

        return max;
    });

	// scale y-axis
    var measureScale = d3.scale.linear()
        .range([height, 100])
        .domain([0,maxY]);

    // make y-axis
    var measureAxis = d3.svg.axis()
        .scale(measureScale)
        .orient("right");

    // append axis to canvas
    d3.select('#chart').append('g')
          .attr('class', 'yAxis')
          .attr("transform", "translate(" + width + " , -15)")
          .call(measureAxis);

    // add label to y-axis
    d3.select(".yAxis")
          .append("text")
          .attr('class', 'label')
          .text("Reviews per week")
          .attr("transform", "translate(45,215) rotate(90)");    

    // function to draw line in graph depending on neighbourhood data
    var drawChart = function(field) {

		// empty chart
		d3.select('#chart').select('.x.axis').remove();
		d3.select('#chart').select('path').remove();

		// update the Neighbourhood title
		d3.select('#heading')
			.text(field.replace(/_/g, ' '));

		// update the airbnb count title
		d3.select('#amount')
			.text("Amount of Airbnb's: " + data[1][field.replace(/ /g, '_')
                        	   							.replace(/\//g, '_')]);

		// filter missing data out of data
		var neighData = data[2].filter(function(d) {
			return d[field];
		});

		// get min/max dates
		var timeExtent = d3.extent(neighData, function(d){
			return format.parse(d['timestamp']);
		});

		// scale x-axis
		var timeScale = d3.time.scale()
			.range([0, width - margin])
			.domain(timeExtent);

		// make x-axis
		var timeAxis = d3.svg.axis()
			.scale(timeScale)
			.tickFormat(d3.time.format("%b '%y"));

		// append axis to chart
		d3.select('#chart').append('g')
			.attr('class', 'x axis')
			.attr('transform', "translate(" + margin + ',' + (height - 15) +
				  ")")
			.call(timeAxis)
			.selectAll("text")
			.attr("y", 0)
			.attr("x", 9)
			.attr("dy", ".35em")
			.attr("transform", "rotate(90)")
			.style("text-anchor", "start");

		// define chart line
		var line = d3.svg.line()
		       .x(function(d) { return timeScale(format.parse(d['timestamp'])); })
		       .y(function(d) { return measureScale(+d[field]); });

		// append chart line to chart
		d3.select('#chart').append("path")
		.datum(neighData)
		.attr("class", "line")
		.attr("d", line)
		.attr('transform', 'translate(' + margin + ', -15)');
	};

	// draw chart
    drawChart(field);

	// make function for mouse over
	var mouseOver = function(d) {
		var neigh = d.properties.neighbourhood;
		d3.select('#map path.' + neigh).style('fill', 'black');

		drawChart(neigh);
	};

	// make function for mouse out
	var mouseOut = function(d) {
	var neigh = d.properties.neighbourhood;
		d3.select('path.' + neigh).style('fill', '#fd5c63');
	}

	// attach functions to map
	map.on("mouseover", mouseOver);
	map.on("mouseout", mouseOut);

	// attach functions to bubbles in map
	bubbles.on('mouseover', mouseOver);
	bubbles.on('mouseout', mouseOut);
	};

}
