/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 4
*	test.js
*/

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement);

    // define colors for legend
    var colors = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45", "#005824"]

    // define tags for legend
    var tags = ["100", "1000", "10000", "100000", "1000000", "10000000",        "Unknown Data"]

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[0])
        .attr("x", 48)
        .attr("y", 33)
        .text(tags[0]);

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[1])
        .attr("x", 48)
        .attr("y", 77)
        .text(tags[1]);

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[2])
        .attr("x", 48)
        .attr("y", 117)
        .text(tags[2]);

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[3])
        .attr("x", 48)
        .attr("y", 158)
        .text(tags[3]);  

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 13)
        .attr("y", 138.7)
        .attr("width", 21)
        .attr("height", 29)
        .attr("class", "st1")
        .style("fill", colors[3]);

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 13)
        .attr("y", 180)
        .attr("width", 21)
        .attr("height", 29)
        .attr("class", "st1")
        .style("fill", colors[4]);    

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 46,5)
        .attr("y", 180)
        .attr("width", 119.1)
        .attr("height", 29)
        .attr("class", "st1")

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[4])
        .attr("x", 48)
        .attr("y", 199)
        .text(tags[4])

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 13)
        .attr("y", 220)
        .attr("width", 21)
        .attr("height", 29)
        .attr("class", "st1")
        .style("fill", colors[5]);    

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 46,5)
        .attr("y", 220)
        .attr("width", 119.1)
        .attr("height", 29)
        .attr("class", "st1")

    d3.selectAll("svg")
        .append("text")
        .style("fill", colors[5])
        .attr("x", 48)
        .attr("y", 240)
        .text(tags[5])    

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 13)
        .attr("y", 260)
        .attr("width", 21)
        .attr("height", 29)
        .attr("class", "st1")
        .style("fill", "grey");    

    d3.selectAll("svg")
        .append("rect")
        .attr("x", 46,5)
        .attr("y", 260)
        .attr("width", 119.1)
        .attr("height", 29)
        .attr("class", "st1")

    d3.selectAll("svg")
        .append("text")
        .style("fill", "grey")
        .attr("x", 48)
        .attr("y", 280)
        .text(tags[6]) 

    // change colors of rects
    d3.select("#kleur1")
    	.style("fill", colors[0]);

    d3.select("#kleur2")
    	.style("fill", colors[1]);	

    d3.select("#kleur3")
    	.style("fill", colors[2]);	
});
