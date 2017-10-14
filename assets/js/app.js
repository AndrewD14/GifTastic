//global variables
var topic = ["Super Sayian", "Final Fantasy"];


//function to grab data from the api
function getGif(search){
	//various api parameters
	var queryURL = "https://api.giphy.com/v1/gifs/search";
	var apikey = "bbPNFKOvjhX2X9elWklBGJiZqggvbajP";
	var limits = 10;
	var maxRatingAllowed = "pg-13";
	
	var inputs = {};

	//adds the elements to the url if the variable have data
	if(apikey != null && apikey != "")
		inputs.api_key = apikey;

	if(limits != null && limits != "")
		inputs.limit = limits;

	if(search != null && search != "")
		inputs.q = search;
	inputs.q = "bears";

	if(maxRatingAllowed != null && maxRatingAllowed != "")
		inputs.rating = maxRatingAllowed;


	//calls the api and executes functions based on success or failure
	$.ajax({
		url: queryURL,
		method: "GET",
		data: inputs
	}).done(generatePictures)
	.fail(apiError)
	.always(function(response){
		console.log(this.url)
	});
}

//processes the response from the api
function generatePictures(response){
	console.log(response);

	
}

//displays the error if the api calls fails
function apiError(response){
	var responseText = $.parseJSON(response.responseText);
	$("#error").html("There was an error calling the Giphy API.<br>Status: "+responseText.meta.status+"<br>"+responseText.meta.msg);
}

//generates the buttons and populates it on the page
function displayButtons(){
	for(i in topic){
		var newBtn = $("<button>");
		newBtn.attr("search", topic[i]);
		newBtn.html(topic[i]);
		newBtn.on("click", searchForGif);

		$("#buttons").append(newBtn);
	}
}

//onclick function to pass the search term and call the api
function searchForGif(){
	getGif($(this).attr("search"));
}