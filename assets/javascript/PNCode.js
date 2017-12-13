// Initialize Firebase
var config = {
	apiKey: "AIzaSyDuKVcxXFGtR58diOHgwY4id81rvQ-Ibtc",
    authDomain: "classdemo-fdbbe.firebaseapp.com",
    databaseURL: "https://classdemo-fdbbe.firebaseio.com",
    projectId: "classdemo-fdbbe",
    storageBucket: "classdemo-fdbbe.appspot.com",
    messagingSenderId: "81003018946"
};

firebase.initializeApp(config);
// Assign the reference to the database to a variable named 'database'
//var database = ...
var database = firebase.database();

var game = 
{//create a game object
  	time: 0,
  	question: 0,
  	timeID: 0,
  	player1Score:0,
  	player2Score:0,
  	Player1Time:0,
  	Player2Time:0,
  	Player1Name:"None",
  	Player2Name:"None",
  	myDivGameArea: $("#content"),
  	myDivTimeRemaining:$("<div/>", {"id": "timeRemaining"}),
  	myDivQuestion:$("<div/>", {"id": "questionPic"}),
  	myDivAnswer1:$("<div/>", {"class": "answer col-12"}),
  	myDivAnswer2:$("<div/>", {"class": "answer col-12"}),
  	myDivAnswer3:$("<div/>", {"class": "answer col-12"}),
  	myDivAnswer4:$("<div/>", {"class": "answer col-12"}),
  	startNewGame: function() 
  	{//set up the first question and initialize the div and variables
	    game.time = 10;
	    game.question = 0;
	    game.player1Score =0;
	    game.player2Score =0;
	    game.player1Time =0;
	    game.player2Time =0;
	    $.ajax(
	    {
			url: 'https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple',
			method: 'GET',
		}).done(function(response) 
		{
			//console.log(response);
			// looping through results and log
			for (var i = 0; i < response.results.length; i++) 
			{
				console.log(response.results[i]);
				game.loadQuestions(response.results[i],i);
			}
		});
	},
	loadQuestions: function(object,index)//load the new questions into the database
	{
		database.ref("Game").child("question" + index).child("question").set(object.question);
		database.ref("Game").child("question" + index).child("answer").set(object.correct_answer);
		database.ref("Game").child("question" + index).child("wrong1").set(object.incorrect_answers[0]);
		database.ref("Game").child("question" + index).child("wrong2").set(object.incorrect_answers[1]);
		database.ref("Game").child("question" + index).child("wrong3").set(object.incorrect_answers[2]);
	},
	getPlayerName: function()
	{			            
		$("#content").append('Enter your name to begin:<br><form name="message" action=""> Player Name: <input name="usermsg" type="text" id="userName" class="col-8"/><input name="submitName" type="submit"  id="submitName" value="Send" /></form></div></div>')
	}

};

game.getPlayerName();
game.startNewGame();

$(document).on("click", "#submitName" , function(event)//enter your name
{	// Prevent form from submitting
  	event.preventDefault();
  // Get the input values
  var playerName = $("#userName").val().trim();
  database.ref("Game").child("Player").set(playerName);
  $('#userName').val('');
});

/*			
	    $(pokemon).each(function(index,item)
	    {
	    	// create the questions
	    	questions[index] = new questionObj(index,item);
	    });
	game.myDivGameArea.empty();
    game.myDivGameArea.append(game.myDivTimeRemaining);
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>Can you guess the Pokemon?</h4></div>");
    game.myDivGameArea.append(game.myDivQuestion.html('<img src= '+ questions[game.question].qpic +' class ="question rounded mx-auto d-block img-fluid"/>'));
    game.myDivGameArea.append(game.myDivAnswer1.html(questions[game.question].answers[0]));
    game.myDivAnswer1.attr("data-a",0);
    game.myDivGameArea.append(game.myDivAnswer2.html(questions[game.question].answers[1]));
    game.myDivAnswer2.attr("data-a",1);
    game.myDivGameArea.append(game.myDivAnswer3.html(questions[game.question].answers[2]));
    game.myDivAnswer3.attr("data-a",2);
    game.myDivGameArea.append(game.myDivAnswer4.html(questions[game.question].answers[3]));
    game.myDivAnswer4.attr("data-a",3);
    $(game.myDivAnswer1).addClass("answer");
  	$(game.myDivAnswer2).addClass("answer");
  	$(game.myDivAnswer3).addClass("answer");
  	$(game.myDivAnswer4).addClass("answer");

 // The page has loaded for the first time
$( document ).ready(function() {
	getCurrentGameInfo();

    getPlayerName();
    //initializeGame();
});

//welcome player enter your name
function getPlayerName(){

}

  $(document).ready(function() {

	$.ajax({
		url: 'https://opentdb.com/api.php?amount=10',
		method: 'GET',
	}).done(function(response) {
		console.log(response);

		// looping over results, and printing each question
		for (var i = 0; i < response.results.length; i++) {
			//if (i === 0) printQuestion(response.results[i]);
			printQuestion(response.results[i]);

		}
	});

	// expects object:
	// 	{
	//		question: 'string',
	//		incorrect_answers: [],
	//		correct_answer: 'string',
	// 	}
	//
	// 	returns a div with children:
	//		question,
	//		list of answers
	function printQuestion(question) {
		var question_container = $('<div>');

		var question_element = $('<h1>').html(question.question);

		// create answers array from correct 
		// answer and incorrect answers
		var answers = [];		
		question.incorrect_answers.forEach(function (answer) {
			answers.push({ text: answer, data: 'incorrect' });
		});
		answers.push({ 
			text: question.correct_answer, 
			data: 'correct',
		});

		// passing our array and an object with possible on 
		// click event to bind on each child
		var answers_element = createElementsFromArray(answers, {
			clickEvent: function(event) {
				if (this.dataset.correct) {
					$(this).addClass('correct');
				} else if (this.dataset.incorrect) {
					$(this).addClass('incorrect');
				}
			},
		});

		// append our new elements to our parent
		question_container.append(question_element);
		question_container.append(answers_element);
		
		// append to the page
		$('#app').append(question_container);
	}

	// expects:
	// [
	//		{ text: 'string', data: 'string' }
	// ],
	// optional {
	//		clickEvent: function() {}
	// }
	function createElementsFromArray(array, options) {

		// create parent element
		var elementsList = $('<ul>');

		// loop to create children
		for (var i = 0; i < array.length; i++) {

			// create child element with text from object
			var child = $('<li>').html(array[i].text);
			child.attr('data-' + array[i].data, 'true');

			// if there is a clickEvent, add it to each child
			if (options && options.clickEvent) {
				child.on('click', options.clickEvent);
			}

			// add child to parent
			elementsList.append(child);
		}

		return elementsList;

	}

});


/*pseudocode section for game section

function initialize game{
	pick player number 1 or 2
	choosse 1 or 2 player game
	choose a category
}

function get questions{
	grab the 10 questions and save them in the database
}

function ask a question{
	display question
	display choices
}

function countdown{
	count down timer 20 secs / question
}

function process answer choices{
	get the player(s) answers and send to database if needed
	check them against the right answer
	update scores to database
}

function show corect answer{
	show answer with a gif from gify
	update scores to local screens move on to next question or end game if q 10
}

function end game{
	show final score
	offer another round or just start next round.
}




*/