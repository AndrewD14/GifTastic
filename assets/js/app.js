//global variables
var topic = ["Super Sayian", "Final Fantasy"];
var imageObjects = {};

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

	if(maxRatingAllowed != null && maxRatingAllowed != "")
		inputs.rating = maxRatingAllowed;


	//calls the api and executes functions based on success or failure
	$.ajax({
		url: queryURL,
		method: "GET",
		data: inputs
	})
	.done(generatePictures)
	.fail(apiError)
	.always(function(response){
		console.log(this.url)
	});
}

//processes the response from the api
function generatePictures(response){
	console.log(response);

	//stores the images
	imageObjects = response.data;

	//clear the current gifs
	$("#giphy").empty();

	//loops through the response and creates elements to display on the page
	for(i in imageObjects){
		var newGif = $("<div>");

		var newImg = $("<img>");
		newImg.attr("src", imageObjects[i].images.fixed_height_small_still.url);
		newImg.attr("index", i);
		newImg.attr("state", "still");
		newImg.addClass("clickImg");

		newGif.append(newImg);

		$("#giphy").append(newGif);
	}
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
		newBtn.addClass("displayButtons");

		$("#buttons").append(newBtn);
	}
}

//onclick function to pass the search term and call the api
function searchForGif(){
	getGif($(this).attr("search"));
}

//onclick function to swap between animated and still
function switchStates(){
	var currentEle = $(this);

	if(currentEle.attr("state") == "still"){
		currentEle.attr("src", imageObjects[currentEle.attr("index")].images.fixed_height_small.url);
		currentEle.attr("state", "animated");
	}
	else {
		currentEle.attr("src", imageObjects[currentEle.attr("index")].images.fixed_height_small_still.url);
		currentEle.attr("state", "still");
	}
}

