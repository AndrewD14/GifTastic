//global variables
var topic = ["Super Saiyan", "Final Fantasy", "Zelda", "Link", "Cowboy Bebop", "Trigun", "Dragon Ball Z", "Goku", "Vegeta", "Dragon Ball Super", "Cloud Strife", "Tifa Lockhart",
			 "Horizon Zero Dawn", "Sephiroth"];
var imageObjects = [];
var limits = 10;
var errorLimit = 5;
var errorCount = 0;
var currentSearch = "";

var apikey = "bbPNFKOvjhX2X9elWklBGJiZqggvbajP";

//function to grab data from the api
function getGif(){
	//only runs if there is a search term
	if(currentSearch != null && currentSearch != ""){
		//various api parameters
		var queryURL = "https://api.giphy.com/v1/gifs/random";
		
		var maxRatingAllowed = "pg-13";
		
		var inputs = {};

		//adds the elements to the url if the variable have data
		if(apikey != null && apikey != "")
			inputs.api_key = apikey;

		inputs.tag = currentSearch;

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
		;
	}
}

//gets the img info with the id from the random api call
function getImgInfo(id){
	//various api parameters
	var queryURL = "https://api.giphy.com/v1/gifs";
	
	var inputs = {};

	//adds the elements to the url if the variable have data
	if(apikey != null && apikey != "")
		inputs.api_key = apikey;

	if(id != null && id != "")
		inputs.ids = id;


	//calls the api and executes functions based on success or failure
	$.ajax({
		url: queryURL,
		method: "GET",
		data: inputs
	})
	.done(parseImgInfo)
	.fail(apiError)
	;
}

//processes the response from the api for random
function generatePictures(response){
	//gets more info on the img
	getImgInfo(response.data.id);
}

//process the img info
function parseImgInfo(response){
	var found = false;

	//checks to make sure the image was not already pulled
	for(i in imageObjects){
		if(imageObjects[i].id === response.data[0].id)
			found = true;
	}
	
	if(!found)
		//stores the images
		imageObjects.push(response.data[0]);

	//resets the error count since there was a success
	errorCount = 0;

	if(imageObjects.length < limits)
		getGif();
	else
		displayImages();

}

//displays the pictures
function displayImages(){
	//clear the current gifs
	$("#giphy").empty();

	//loops through the response and creates elements to display on the page
	for(i in imageObjects){
		var newGif = $("<div>");
		newGif.addClass("gif");

		//creates the rating p to append
		var newPara = $("<p>");
		newPara.html("<b>Rating:<b> "+imageObjects[i].rating);

		var newImg = $("<img>");
		newImg.attr("src", imageObjects[i].images.fixed_height_small_still.url);
		newImg.attr("index", i);
		newImg.attr("state", "still");
		newImg.addClass("clickImg");

		//boostrap classes
		newGif.addClass("float-left");

		//appends the elements
		newGif.append(newPara);
		newGif.append(newImg);

		$("#giphy").append(newGif);
	}
}

//displays the error if the api calls fails
function apiError(response){
	var responseText = $.parseJSON(response.responseText);
	$("#error").html("There was an error calling the Giphy API.<br>Status: "+responseText.meta.status+"<br>"+responseText.meta.msg);
	$("#error").css("display", "block");

	//increments the error count
	errorCount++;

	//calls the api again
	if(errorCount < errorLimit)
		getGif();
}

//generates the buttons and populates it on the page
function displayButtons(){
	//clears the buttons to prevent duplicating the list
	$("#buttons").empty();

	//generates the buttons with the keyWords from the array
	for(i in topic){
		var newBtn = $("<button>");
		newBtn.attr("search", topic[i]);
		newBtn.html(topic[i]);
		newBtn.addClass("displayButtons");

		//boostrap classes
		newBtn.addClass("btn");
		newBtn.addClass("btn-outline-primary");

		$("#buttons").append(newBtn);
	}
}

//onclick function to pass the search term and call the api
function searchForGif(){
	//hides the error box and clears it at the start of the call
	$("#error").css("display", "none");
	$("#error").html("");

	//sets the search term
	currentSearch = $(this).attr("search");

	//clears the current image
	imageObjects = [];

	//clear the current gifs
	$("#giphy").empty();

	//displays a message for getting gifs
	$("#giphy").html("Retrieving images... <img src='assets/images/loading.gif' height='30px' width='30px' />");

	//calls the random Giphy API
	getGif();
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

//function to handle the submit request
function addSearch(){
	//prevents the submit type button from refreshing the page
	event.preventDefault();

	//checks to make sure the box is not empty
	var term = $("input[name='keyWord']").val().trim();

	if(term != "")
		topic.push($("input[name='keyWord']").val().trim());

	//clears the text in the box
	$("input[name='keyWord']").val("");

	//calls to redisplay the buttons
	displayButtons();
}