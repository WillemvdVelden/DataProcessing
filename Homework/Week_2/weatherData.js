/**
*	Willem van der Velden
*	Minor Programmeren Fall 2017
*	Data Processing
*	Week 2
*	weatherData.js
*/

// initialize a new ctx
var request = new XMLHttpRequest();

// check if response is done properly and save response
request.onreadystatechange = function() {
	if(request.readyState === 4 && request.status === 200) {
	   var rawData = request.responseText
	   graphMaker(rawData);
	}	
};


// open file and send ctx
request.open('GET', 'data.csv', true);
request.send();


function graphMaker(rawData) {
	rawData = rawData.split("\n")
	var dates = []

	for(i = 0; i < rawData.length - 1; i++){
		dates.push(rawData[i])
	}

	var temperatures = []

	// parse the data into JavaScript dates and numbers
	for(i = 0; i < dates.length - 1; i++){
		dates[i] = dates[i].split(",")
		dates[i][1] = dates[i][1].slice(0, 4) + "-" + dates[i][1].slice(4, 6) + "-" + dates[i][1].slice(6, 8)
		dates[i][1] = new Date(dates[i][1])
		dates[i][2] = Number(dates[i][2])
		temperatures.push(Number(dates[i][2]))
	}

	// get the canvas element and set it's parameters
	var canvas = document.getElementById("myCanvas")
	var ctx = canvas.getContext("2d")
	var width = canvas.width = 1000
	var height = canvas.height = 650

	function createTransform(domain, range){
		// domain is a two-element array of the data bounds [domain_min, domain_max]
		// range is a two-element array of the screen bounds [range_min, range_max]
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

	// define padding for both axes
	var paddingY = 10
	var paddingX = 2 * paddingY

	// make a new function with the function createTransform returns, but with the right parameters
	var yAxeNew = createTransform([-50, 300], [height - height / paddingY, height / paddingY])
	var xAxeNew = createTransform([0, 365], [width / paddingX, width])

	// initiate and draw the path
	ctx.beginPath()
	ctx.moveTo(xAxeNew(0), yAxeNew(temperatures[0]))
	ctx.strokeStyle = '#ff0000';
    ctx.stroke();

	for(i = 0; i < temperatures.length; i++){
		ctx.lineTo(xAxeNew(i), yAxeNew(temperatures[i]))
	}

	// make graph and axis titles
	ctx.font = "20px Courier New"
	ctx.textAlign = "center"
	ctx.fillText("Average temperature in De Bilt (2016)", width / 2, 2 * paddingX)

	ctx.font = "13px Courier New"
	ctx.fillText("Months", (width + 60) / 2, height - paddingY)

	ctx.save()
	ctx.translate(1 * paddingX, (height - 45 * paddingY) / 1.7)
	ctx.rotate(-Math.PI / 2)
	ctx.fillText("Temperature", 0, 0)
	ctx.restore()

	var xOneTick = (width - width / paddingX) / 11
	var yOneTick = ((height - height / paddingY) - (height / paddingY)) / 7
	var tickSize = 5

	// draw x-axis
	ctx.moveTo(width / paddingX, height - height / paddingY)
	for(i = 0; i < 12; i++){
		ctx.lineTo(width / paddingX + i * xOneTick, height - height / paddingY)
		ctx.lineTo(width / paddingX + i * xOneTick, (height - height / paddingY) + tickSize)
		ctx.moveTo(width / paddingX + i * xOneTick, height - height / paddingY)
	}

	// draw y-axis with tick values
	ctx.moveTo(width / paddingX, height - height / paddingY)
	for(i = 0; i < 8; i++){
		ctx.lineTo(width / paddingX, height - height / paddingY - i * yOneTick)
		ctx.lineTo(width / paddingX - tickSize, (height - height / paddingY) - i * yOneTick)
		ctx.moveTo(width / paddingX, height - height / paddingY - i * yOneTick)
		ctx.fillText(-5 + 5 * i, width / paddingX - 3 * tickSize, (height - height / paddingY) - i * yOneTick + height / 90)
	}

	// make array with months
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

	ctx.font = "10px Courier New"
	ctx.textAlign = "right"

	// draw months names rotated on the x-axis
	for(i = 0; i < 12; i++){
		ctx.save()
		ctx.translate(width / paddingX + i * xOneTick, (height - height / paddingY) + 2 * tickSize)
		ctx.rotate(-Math.PI / 4)
		ctx.fillText(months[i], 0, 0)
		ctx.restore()
	}
	ctx.stroke()
}





