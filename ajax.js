var filename = "../data/data.json";
var response;

var request = new XMLhttpRequest();
request.onreadystatechange = function(){
	if(this.readystate == 4 && this.status == 200){
		// request is succesfully
		var response = this.responseText;
		callbackExample(response);
	}	
};

request.open("GET", filename);
request.send();

function callbackExample(response){
	console.log(JSON.parse(response).data);
}

console.log("110" < "90");
console.log(110 < 90);

window.onload = function(){

}


// server openen
// python -m SimpleHTTPServer 8080



