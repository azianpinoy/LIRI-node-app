var twitterKeys = require('./keys.js');
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var command = process.argv[2];

var inputsArray = process.argv;

var song = "";
var movie = "";

for(var i = 3; i < inputsArray.length; i++){
	song = song + inputsArray[i] + " ";
	movie = movie + inputsArray[i] + " "; 
}


function runProcess(){
	if (command == 'my-tweets'){

		var client = new Twitter(twitterKeys.twitterKeys);

		client.get('statuses/user_timeline',{sreen_name: 'jdechavez23', count: 20}, function(error, tweets, response) {
			console.log('Last 20 Tweets:');

			for(var i = 0; i < tweets.length; i++){
				var number = i + 1;
				console.log(number + ': ' + tweets[i].text + '\n     Created on: ' + tweets[i].created_at);
			}
		});

	}
	else if(command == 'spotify-this-song'){
		//List information of song
		if(song == ""){
			song = 'The Sign Ace of Base';
		}

		var spotify = new Spotify({
		  id: '0116315a4a2f438ba2d848534e66a68f',
		  secret: '8e7367f869344ec5aa2d51d7a6705048' 
		});

		spotify.search({ type: 'track', query: song, limit: 3 }, function(err, data) {
	  		if (err) {
	  			console.log('Song could not be found.');
	    		return console.log('Error occurred: ' + err);
	  		}
	 		
			console.log('Artist: ' + data.tracks.items[0].artists[0].name);
			console.log('Song Name: ' + data.tracks.items[0].name);
			console.log('Preview URL: ' + data.tracks.items[0].preview_url);
			console.log('Album: ' + data.tracks.items[0].album.name);
		});

	}
	else if(command == 'movie-this'){
		//List information of movie
		if(movie == ""){
			movie = 'Mr.Nobody';
		}

		var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

		request(queryUrl, function(error, response, body) {
			if(JSON.parse(body).Title == undefined){
				console.log('Movie could not be found.');
			}
			else if (!error && response.statusCode === 200) {
				console.log("Movie: " + JSON.parse(body).Title);
				console.log("Release Year: " + JSON.parse(body).Year);
				console.log("IMDB Rating: " + JSON.parse(body).Ratings[0]['Value']);
				console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]['Value']);
				console.log("Country: " + JSON.parse(body).Country);
				console.log("Language: " + JSON.parse(body).Language);
				console.log("Plot: " + JSON.parse(body).Plot);
				console.log("Main Cast: " + JSON.parse(body).Actors);
	  		}
	  		else{}
		});
	}
	else if(command == 'do-what-it-says'){
		fs.readFile("random.txt", "utf8", function(error, data) {
			if (error) {
	    		return console.log(error);
	  		}

	  		var dataArray = data.split(',');

	  		command = dataArray[0];
	  		song = dataArray[1];
	  		movie = dataArray[1];

	  		runProcess();
		})
	}
	else{
		console.log('Command not recognized. Please try again.')
	}
}

runProcess();