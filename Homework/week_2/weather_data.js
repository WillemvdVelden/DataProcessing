/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 2
*	weather_data.js
*/


// var filename = "../Desktop/DataProcessing/Homework/week_2/data.csv";
// var response;

// initialize a new request
var request = new XMLhttpRequest();

// check if response is done properly and save response
request.onreadystatechange = function() {
	if(request.readystate == 4 && request.status == 200) {
	   var rawData = request.responseText;
	   Graphmaker(rawData);
	   callbackExample(rawData);
	}	
};

function callbackExample(rawData) {
	console.log(JSON.parse(rawData).data);
}

// open file and send request
request.open("GET", data.csv, true);
request.send();

function Graphmaker(rawData) {

	// split data from file
	var rawData = rawData.split('\n');
	
	// initiate variables
	var temperatures = [];
	var dates = [];

	// iterate over data and reformat to Javascript dates and numbers
	for (i = 0; i < rawData.length; i++) {
		dates[i] = rawData[i].slice(0,8);
		dates[i] = dates[i].slice(4,6) + '-' + dates[i].slice(6,8) + '-' +
				   dates[i].slice(0,4);
		dates[i] = new Date(dates[i]);

		temperatures.push(Number(rawData[i].slice(9)));
	}

	console.log(dates);
	console.log(temperatures);

	// initiate and add specs to canvas
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var width = canvas.width = 650;
	var height = canvas.height = 325;

	function createTransform(domain, range){
		// domain is a two-element array of the data bounds 
		// [domain_min, domain_max]
		// range is a two-element array of the screen bounds [range_min,       // range_max]
		// this gives you two equations to solve:
		// range_min = alpha * domain_min + beta
		// range_max = alpha * domain_max + beta
	 	// a solution would be:

	    var domain_min = domain[0]
	    var domain_max = domain[1]
	    var range_min = range[0]
	    var range_max = range[1]

	    // formulas to calculate the alpha and the beta
	   	var alpha = (range_max - range_min) / (domain_max - domain_min)
	    var beta = range_max - alpha * domain_max

	    // returns the function for the linear transformation (y= a * x + b)
	    return function(x){
	      return alpha * x + beta;
	    }
	}

	// initiate padding for axes
	var paddingY = 6
	var paddingX = 3 * paddingY

	// transform axes with right parameters
	var xAxeNew = createTransform([-35, 270], [height - height / paddingY, 			  height / paddingY])
	var yAxeNew = createTransform([0, 365], [width / paddingX, width])

	// initiate and draw the path
	ctx.beginPath()
	ctx.moveTo(xAxeNew(0), yAxeNew(temperatures[0]))

	for(i = 0; i < temperatures.length; i++) {
		ctx.lineTo(xAxeNew(i), yAxeNew(temperatures[i]))
	}






