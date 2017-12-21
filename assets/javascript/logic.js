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
  time: 0,//countdown timer
  question: 0,//what question we are on
  timeID: 0,//id for the countdown timer
  player:0,//my player number
  categoryList: ["Science & Nature","Sports","Geography","History","Celebrities","Art"],
  categoryIcons: ["./assets/images/science.jpg","./assets/images/sports.jpg","./assets/images/geography.jpg","./assets/images/history.jpg","./assets/images/celebrities.jpg","./assets/images/art.jpg"],
  categoryNums: [17,21,22,23,26,25],//useful for the trivia api they correlate to the categories
  category:0,//the nubmer from the list above that we chose for this game
  categoryImage:"x",
  categoryName: "None",//the name of the category chosen from categoryList
  playerScore:[0,0],//number of correct questions
  playerTime:[0,0],//time spent total per question per player so far
  playerAnswered:[0,0],//have you answered the current question?
  playerHere:["no","no"],//are you here and registered in the database?
  playerName:["None","Not Arrived"],//player names
  myDivGameArea: $("#content"),//the div i write the game into
  theQuestion:"None",//the current question text
  theAnswer:"None",//the current answer text
  answerArray:0,//an array for holding the answers available for the current question.  
  answerNum:0,//the array location of the correct answer in the list of answerArray
  playingComputer:0,//is the opponent real or a PC?
  started:0,//has someone started the game?
  go:0,//the category got picked, let's go! - tells the other player to grab question 0
  startNewGame: function() 
  {//set up the first question and initialize the div and variables
    game.question = 0;
    game.time = 15;
    database.ref("Player" + game.player).child('Answered').set(0);
    database.ref("Player" + game.player).child("Score").set(0);
    database.ref("Player" + game.player).child("Time").set(0);
    if(game.playingComputer == 1)//you are playing against the PC
    {
      if(game.player == 1)//you're player 1
      {
        database.ref("Player2").child("Score").set(0);
        database.ref("Player2").child("Time").set(0);
      }
      else//you're player 2, so let's update the computer score 
      {
        database.ref("Player1").child("Score").set(0);
        database.ref("Player1").child("Time").set(0); 
      }
    }
    clearInterval(game.timeID);//
    game.timeID = setInterval(function(){ game.count(); }, 1000);
    game.displayQuestions();
  },
  nextQuestion: function()
  {
    if(game.question == 9)//the game is over
    {
      game.showGameResults();
      game.started = 0;
      database.ref("Game").child('Started').set(0);//the game is starting
      game.go = 0;
      database.ref("Game").child('Go').set(0);//the game is starting
      if(game.playingComputer == 1)//you are playing against the PC
      {
        if(game.player == 1)//you're player 1
        {
          database.ref("Player2").remove();
        }
        else//you're player 2 
        {
          database.ref("Player1").remove();


          //This Code is to push plater 2 stats
          var userName2 = game.playerName[1];
          var userScore2 = game.playerScore[1];
          var userTime2 = game.playerTime[1];

          var newUser2 = {
            name: userName2,
            score: userScore2,
            time: userTime2,
            }
          database.ref("/Highscores").push(newUser2);
        }

          //pushes player1 stats
          var userName1 = game.playerName[0];
          var userScore1 = game.playerScore[0];
          var userTime1 = game.playerTime[0];

          var newUser1 = {
            name: userName1,
            score: userScore1,
            time: userTime1,
            }
          database.ref("/Highscores").push(newUser1);

          //pushes player2

        }
      clearInterval(game.timeID)//
    }
    else
    {
      game.question++;
      game.time = 15;
      database.ref("Player" + game.player).child('Answered').set(0);
      clearInterval(game.timeID);//
      game.timeID = setInterval(function(){ game.count(); }, 1000);
      game.displayQuestions();
    }
  },
  getQuestions: function()
  {
    $.ajax(
    {
      url: 'https://opentdb.com/api.php?amount=10&category=' + game.category + '&difficulty=medium&type=multiple',
      method: 'GET',
    }).done(function(response) 
    {
      // looping through results and log
      database.ref("Game").child("questions").remove();
      for (var i = 0; i < response.results.length; i++) 
      {
        game.loadQuestions(response.results[i],i);
      } 
      game.go = 1;
      database.ref("Game").child("Go").set(1);
      game.startNewGame();
    });
  },
  loadQuestions: function(object,index)//load the new questions into the database
  {
    var randomAnswer = Math.floor(Math.random() * 4);
    var answers = object.incorrect_answers;
    answers.splice(randomAnswer, 0, object.correct_answer);
    database.ref("Game").child("questions").push(
    {
      questionNumber:index,
      question: object.question,
      theAnswer: randomAnswer,
      theAnswers: object.incorrect_answers
    });
  },
  shallWePlay: function()//waiting for player 2 or just start the game
  {
    game.myDivGameArea.empty();//clear out my div and add the category buttons
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>Wait for an opponent or play against the Computer: </h4></div>");
    game.myDivGameArea.append("<div><h5 class='text-center animated zoomInRight' id = 'player1Name'>Player 1: " + game.playerName[0]  + " </h5></div>");
    game.myDivGameArea.append("<div><h5 class='text-center animated zoomInLeft' id = 'player2Name'>Player 2: " + game.playerName[1] + " </h5></div>");
    var myButton = $("<button class='animated infinite pulse' id='startTheGame'>");
    myButton.text("Start")
    game.myDivGameArea.append(myButton);
  },
  tellGameFull: function()//prompt for the player name
  {           
    game.myDivGameArea.empty();//clear out my div and add the category buttons
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>The Game is already full.  Please come back later.</h4></div>");  
  },
  displayCategories: function()
  {
    game.myDivGameArea.empty();//clear out my div and add the category buttons
    //show the category buttons
    $('#content').html('Pick your topic:').css('font-weight', 'bold');
    var btnGroup = ('<div class="button-group center-block">');
    $('#content').append(btnGroup);
    for (var i = 0; i < game.categoryList.length; i++) 
    {
      var topicBtn = $('<div class="topic-button center-block categoryChoice">');
      topicBtn.attr('data-c', game.categoryNums[i]);
      topicBtn.attr("data-n",game.categoryList[i]);
      topicBtn.css('background-image', 'url(' + game.categoryIcons[i] + ')');
      game.categoryImage = game.categoryIcons[i];
      topicBtn.text(game.categoryList[i]);
      $('.button-group').append(topicBtn);
    }
  },
  displayQuestions: function()
  {
    //alert(snapshot.child("Game").child("question0").child("wrong4").val()[2]);
    database.ref("Game").child('questions').orderByChild('questionNumber').equalTo(game.question).on("value", function(snapshot) 
    {
      //console.log(snapshot.val());
      //console.log(snapshot.question.val());
      snapshot.forEach(function(data) 
      {
        game.theQuestion = data.val().question;
        game.answerArray = data.val().theAnswers;
        game.answerNum = data.val().theAnswer;
        game.theAnswer = data.val().theAnswers[game.answerNum];
      });
    });
    //console.log(game.questions[0]);
    game.myDivGameArea.empty();//clear out my div and add the questions
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'timeRemaining'>Time:</h4></div>");
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>" + game.theQuestion +"</h4></div>");
    $(game.answerArray).each(function(index,item)
    {
      //display the questions
      var newDiv = $("<button/>", {"class": "answerChoice button-group col-12"});
      newDiv.attr("data-i",index);
      newDiv.attr("data-a",game.answerNum);
      game.myDivGameArea.append(newDiv.text(item));
    });
  },
  showAnswer: function(yourAnswer)
  {
    //clear out any previous info
    game.myDivGameArea.empty();//clear out my div and add the gif and answer and score etc
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=25&rating=PG-13&q=" + game.theAnswer;
    var gifImage = $("<img>");//create an image to hold our picture
    //var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=otmUp6QPpF5WcA2wbRV2tR4o5vQhx9WS&rating=G&tag=" + game.theAnswer;
    //https://api.giphy.com/v1/gifs/random?api_key=otmUp6QPpF5WcA2wbRV2tR4o5vQhx9WS&tag=elbow&rating=G
    //dc6zaTOxFJmzC a public key
    //console.log(queryURL);
    $.ajax(
    {
      url: queryURL,
      method: "GET"
    }).done(function(gifSearch)
    {
      if(gifSearch.pagination.total_count == 0)
      {
        $(gifImage).attr("src", game.categoryImage);//use a placeholder
      }
      else if(gifSearch.pagination.total_count == 1)
      {
        var randomImage = 0;
        $(gifImage).attr("src", gifSearch.data[randomImage].images.fixed_width.url);//use the only one we got
      }
      else if(gifSearch.pagination.total_count < 25)
      {
        var randomImage = Math.floor(Math.random() * gifSearch.pagination.total_count);
        $(gifImage).attr("src", gifSearch.data[randomImage].images.fixed_width.url);
      }
      else
      {
        var randomImage = Math.floor(Math.random() * 25);
        $(gifImage).attr("src", gifSearch.data[randomImage].images.fixed_width.url);
      }
      var gifDiv = $("<div class='gifDiv'>");//create a div for the elements
      var p = $("<p>").text("The answer was: " + game.theAnswer);//create a p for our rating text
      $(gifImage).addClass("aGif");//i'll detect a click with this later
      //build our gifDiv and append it to our content area
      gifDiv.append(p);
      gifDiv.append(gifImage);
      gifDiv.addClass("float-left bg-light border border-light")
      $("#content").append(gifDiv);
      //IF You are playing against the PC, calculate the PC score
      if(game.playingComputer == 1)//you are playing against the PC
      {
        var randomTime = Math.floor(Math.random() * 15) + 1;
        var randomCorrect = Math.floor(Math.random() * 2);
        if(game.player == 1)//you're player 1
        {
          randomCorrect = game.playerScore[1] + randomCorrect;
          randomTime = game.playerTime[1] + randomTime;
          database.ref("Player2").child('Time').set(randomTime);
          database.ref("Player2").child('Score').set(randomCorrect);
        }
        else//you're player 2, so let's update the computer score 
        {
          randomCorrect = game.playerScore[0] + randomCorrect;
          randomTime = game.playerTime[0] + randomTime;
          database.ref("Player1").child('Time').set(randomTime);
          database.ref("Player1").child('Score').set(randomCorrect); 
        }
      }
      /*
      game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalTime1'>" + game.playerName[0] + " Time: "+ game.playerTime[0]+ "</h4></div>");
      game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalScore1'>" + game.playerName[0] + " Score: "+ game.playerScore[0]+ "</h4></div>");
      game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalTime2'>" + game.playerName[1] + " Time: "+ game.playerTime[1]+ "</h4></div>");
      game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalScore2'>" + game.playerName[1] + " Score: "+ game.playerScore[1]+ "</h4></div>");          
      */
      //update scoreboard
      $("#p1score").text(game.playerName[0]+ ":   Total Score");
      $("#p1time").text(game.playerName[0]+ ":   Total Time");
      $("#p2score").text(game.playerName[1]+ ":   Total Score");
      $("#p2time").text(game.playerName[1]+ ":   Total Time");
      
      if(yourAnswer == 0)//wrong
      {
        game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalTime'> wrong answer!!!!!</h4></div>");
      }
      else if(yourAnswer == 1)//right
      {
        game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalTime'> right answer!!!!!</h4></div>");
      }
      else if(yourAnswer == 2)//no answer
      {
        game.myDivGameArea.append("<div><h4 class='text-center' id = 'totalTime'> no answer!!!!!</h4></div>");
      }
    });
  },
  outtaTime: function() 
  {console.log("i'm outta time!")
    if(game.playerAnswered[game.player - 1] == 0)//if i haven't answered yet
    {
      var myTime = 15;
      myTime += game.playerTime[game.player -1];
      database.ref("Player" + game.player).child('Time').set(myTime);
      database.ref("Player" + game.player).child('Answered').set(1);
      game.showAnswer(2);//you didn't answer in time
    }
    //clearInterval(game.timeID)//
    //setTimeout(function(){ game.nextQuestion(); }, 8000);
    console.log("outta time");
  },
  count: function()
  {//count down from a given number of seconds
    if(game.time >= 0)
    {
      if((game.player == 1) || (game.playingComputer ==1))
      {
        database.ref("Game").child("timer").set(game.time);//set the timer to 15 seconds
      }
      $("#timeRemaining").text("Time Remaining: " + game.time);
      game.time --
    }
    else
    {
      clearInterval(game.timeID)//
      game.outtaTime();
    }
  },
  updateScoreboard: function()
  {
    var currentQuestion = game.question + 1;

    $('#scoreboard-table > tbody:last-child').prepend('<tr class="animated fadeIn"><td>' + currentQuestion + '</td><td>' + game.playerScore[0] + '</td><td>' + game.playerTime[0] + '</td><td>' + game.playerScore[1] + '</td><td>' + game.playerTime[1] + '</td></tr>');

   },
  showGameResults: function()
  {
    game.myDivGameArea.empty();
    var gameResultsDiv = $('<div class="gameResultsDiv">');
      if (game.playerScore[0] > game.playerScore[1]) //if player 1 has higher score
      {  
      gameResultsDiv.html(game.playerName[0] + ' is smarter than ' + game.playerName[1] + '!').addClass('player1FinalStyle');
      } 
      else if (game.playerScore[0] < game.playerScore[1]) //if player 2 has higher score
      { 
      gameResultsDiv.html(game.playerName[1] + ' is smarter than ' + game.playerName[0] + '!').addClass('player2FinalStyle');
      } 
      else if (game.playerScore[0] == game.playerScore[1] && game.playerTime[0] > game.playerTime[1]) //if tie, but player 1 was faster
      {  
      gameResultsDiv.html(game.playerName[0] + ' may not be smarter, but is definitely faster than ' + game.playerName[1] + '!').addClass('player1FinalStyle');
      } 
      else if (game.playerScore[0] == game.playerScore[1] && game.playerTime[0] < game.playerTime[1]) //if tie, but player 2 was faster
      {  
      gameResultsDiv.html(game.playerName[1] + ' may not be smarter, but is definitely faster than ' + game.playerName[0]).addClass('player2FinalStyle');
      }
    var playAgainDiv = $('<div class="playAgainDiv">');
    playAgainDiv.html('Play again?');
    gameResultsDiv.append(playAgainDiv);
    game.myDivGameArea.append(gameResultsDiv);
    var myButton = $("<button class='animated infinite pulse' id='startTheGame'>");
    myButton.text("Start");
    playAgainDiv.append(myButton);
  },
  leaderboardEndGame: function()
{//adds to the database
//user input is put into variables
  var userName = $("#player").val().trim();
  var userScore = game.playerScore;
  var userTime = game.playerTime;

  var newUser = {
    name: userName,
    score: userScore,
    time: userTime,
  }

  database.ref().push(newUser);

},

};

$(document).ready(function() 
{//when the document loads the first time
  //hide chat log on page load
  $('#chat').hide();
  $('#scoreboard-panel').hide();

  //shows the scores
  database.ref("/Highscores").on("value", function(snapshot) {

  console.log(snapshot.val());

 $.each(snapshot.val(), function(k, v)
  {
    console.log(k)
    console.log(v)

    $("#achievements").append("<div><strong>" + v.name + "</strong><em> Score: </em>: " + v.score + "<em> Time: </em>" + v.time + "</div>");
    });
  });
});

$(document).on("click", "#name-btn" , function(event)//enter your name
{ // Prevent form from submitting
    event.preventDefault();
  // Get the input value and send it to the database
  var playerName = $("#player").val().trim();
  if(playerName.length > 0)
  {
    database.ref("Player" + game.player).child("Name").set(playerName);
    game.playerName[game.player - 1] = playerName;
    $('#userName').val('');
    $('#chat').show();
    game.shallWePlay();
  }
});

$(document).on("click", ".categoryChoice" , function(event)//enter your name
{
  $('#scoreboard-panel').show();
  // Get the category choice and get the questions
  // then we wait for player 2 or start the game
  game.category = $(this).data("c");
  game.categoryName = $(this).data("n");
  database.ref("Game").child("Category").set(game.categoryName);
  game.getQuestions();
});

$(document).on("click", "#startTheGame" , function(event)//start the game
{ //create the gameplay div, load question 1 and start the timer
    if(game.player == 1)//if i'm player 1
    {
      if(game.playerHere[1] == "yes")//is player 2 here?
      {
        game.playingComputer = 0;
        database.ref("Game").child('Computer').set(0);//the game is starting
      }
      else//otherwise i'm playing against the PC
      {
        game.playingComputer = 1;
        database.ref("Game").child('Computer').set(1);//the game is starting
        //database.ref("Player2").child("Answered").set(1);//the computer went already from now on
        database.ref("Player2").child("Name").set("Computer");//set the computer name to computer
        game.playerName[1] = "Computer";
        //game.playerAnswered[1] = 1;
      }
    } 
    else if(game.player == 2)//if i'm player 2
    {
      if(game.playerHere[0] == "yes")//is player 1 here?
      {
        game.playingComputer = 0;
        database.ref("Game").child('Computer').set(0);//the game is starting
      }
      else//otherwise i'm playing against the PC
      {
        game.playingComputer = 1;
        database.ref("Game").child('Computer').set(1);//the game is starting
        //database.ref("Player1").child("Answered").set(1);//the computer went already from now on
        database.ref("Player1").child("Name").set("Computer");//set the computer name to computer
        game.playerName[0] = "Computer";
        //game.playerAnswered[0] = 1;
      }
    }
    game.started = 1;
    database.ref("Game").child('Started').set(1);//the game is starting
    $('#scoreboard-table > tbody').empty();
    game.displayCategories();
});


$(document).on("click", ".answerChoice" , function(event)//choose an answer
{ //create the gameplay div, add time to my timescore and 
  //add to my score if correct.  
  var myTime = (15 - game.time);
  myTime += game.playerTime[game.player -1];
  database.ref("Player" + game.player).child('Time').set(myTime);
  database.ref("Player" + game.player).child('Answered').set(1);


  if($(this).data("i") == $(this).data("a"))//if you picked the right answer
  {
    var myScore = game.playerScore[game.player -1] + 1;
    game.playerScore[game.player -1] = myScore;
    database.ref("Player" + game.player).child('Score').set(myScore);
    game.showAnswer(1);
  }
  else
  {
    game.showAnswer(0);
  }
});

database.ref("Player1/Answered").on("value", function(snapshot) //the timer is counting down
{
  if(game.player > 0)//i'm in the game
  {
    game.playerAnswered[0] = snapshot.val();
    if((game.playerAnswered[0] + game.playerAnswered[1]) == 2)//we both answered
    {
      //show the correct answer page
      //game.displayAnswer();
      //kill the timer
      //update the scorboard-table
      setTimeout(function(){ game.updateScoreboard(); }, 500);
      clearInterval(game.timeID);
      setTimeout(function(){ game.nextQuestion(); }, 8000);
    }
    else if((game.playingComputer == 1)&& (snapshot.val() == 1))
    {
      //update the scorboard-table
      //update the scorboard-table
      setTimeout(function(){ game.updateScoreboard(); }, 500);
      clearInterval(game.timeID);
      setTimeout(function(){ game.nextQuestion(); }, 8000);
    }
    else
    {

    }
  }
});

database.ref("Player2/Answered").on("value", function(snapshot) //the timer is counting down
{
  if(game.player > 0)//i'm in the game
  {
    game.playerAnswered[1] = snapshot.val();
    if((game.playerAnswered[0] + game.playerAnswered[1]) == 2)//we both answered
    {
      //show the correct answer page
      //game.displayAnswer();
      //update the scorboard-table
      //update the scorboard-table
      setTimeout(function(){ game.updateScoreboard(); }, 500);
      //kill the timer
      clearInterval(game.timeID);
      setTimeout(function(){ game.nextQuestion(); }, 8000);
    }
    else if((game.playingComputer == 1)&& (snapshot.val() == 1))
    {
      //update the scorboard-table
      //update the scorboard-table
      setTimeout(function(){ game.updateScoreboard(); }, 500);
      clearInterval(game.timeID);
      setTimeout(function(){ game.nextQuestion(); }, 8000);
    }
    else
    {
      //notify that we are waiting for the other player
    }
  }
});


database.ref("Game/Started").on("value", function(snapshot) //has the game started?
{
  if(game.player > 0)//i'm in the game
  {
    if(game.started == 0)//the other player started the game
    {
      if(snapshot.val() == 1)
      {
        game.started = snapshot.val();
        game.myDivGameArea.empty();//clear out my div and add the category buttons
        game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>Your opponent is choosing a category</h4></div>");
        game.myDivGameArea.append("<div><h5 class='text-center' id = 'player1Name'>Player 1: " + game.playerName[0]  +" </h5></div>");
        game.myDivGameArea.append("<div><h5 class='text-center' id = 'player2Name'>Player 2: " + game.playerName[1] +" </h5></div>");
      }
    }
  }
});

database.ref("Game/Go").on("value", function(snapshot) //player 1 name is set
{
  if(game.player > 0)//i'm in the game
  {
    if(snapshot.val() == 1)
    {
      if(game.go == 0)//the other player picked the category
      {
        game.startNewGame();
      }
    }
  }
});

database.ref("Player1/Name").on("value", function(snapshot) //player 1 name is set
{
  game.playerName[0] = snapshot.val();
  $("#player1Name").text("Player 1: " + game.playerName[0]);
});

database.ref("Player2/Name").on("value", function(snapshot) //player 2 name is set
{
  game.playerName[1] = snapshot.val();
  $("#player2Name").text("Player 2: " + game.playerName[1]);
});


database.ref("Player1/Score").on("value", function(snapshot) //player 1 score updated
{
  game.playerScore[0] = snapshot.val();
});

database.ref("Player2/Score").on("value", function(snapshot) //player 2 score updated
{
  game.playerScore[1] = snapshot.val();
});

database.ref("Player1/Time").on("value", function(snapshot) //player 1 score updated
{
  game.playerTime[0] = snapshot.val();
});

database.ref("Player2/Time").on("value", function(snapshot) //player 2 score updated
{
  game.playerTime[1] = snapshot.val();
});

database.ref("Player1/Here").on("value", function(snapshot) //player 1 is here
{
  game.playerHere[0] = snapshot.val();
});

database.ref("Player2/Here").on("value", function(snapshot) //player 2 is here
{
  game.playerHere[1] = snapshot.val();
});

/*
database.ref("Game/timer").on("value", function(snapshot) //the timer is counting down
{
  //game.time = snapshot.val();
  //$("#timeRemaining").text("Time Remaining: " + game.time);
});*/


database.ref().on("value", function(snapshot) //any change on the database triggers this
{
  //listen for changes to the database
  //alert(snapshot.child("Game").child("question0").child("wrong4").val()[2]);
  //game.questions = snapshot.child("Game").child("questions").val();
  //console.log(game.questions);
  if(game.player == 0)//this is our first look at the database
  {
    if(snapshot.child("Game").child("Started").val() == 1)//the game is already in progress
    {
      game.tellGameFull();
    }
    //Can I be player 1?
    else if(snapshot.child("Player1").child("Here").val() == null)
    {
      //I can be player1
      game.player = 1;
      database.ref("Player1").child("Here").set("yes");
      if(snapshot.child("Player2").child("Here").val() == null)
      {
        //there is no player 2
        game.playerName[1] = "Not arrived";
      }
      else//thre is a player 2 - lets grab the name
      {
        game.playerName[1] = snapshot.child("Player2").child("Name").val();
      }
    }//i can't be player 1, can I be player 2?
    else if(snapshot.child("Player2").child("Here").val() == null)
    {
      //I can be player 2
      game.player = 2;
      database.ref("Player2").child("Here").set("yes");
      if(snapshot.child("Player1").child("Here").val() == null)
      {
        //there is no player 1 name yet
        game.playerName[0] = "Not arrived";
      }
      else//thre is a player 1 - lets grab the name
      {
        game.playerName[0] = snapshot.child("Player1").child("Name").val();
      }
    }
    else
    {
      game.tellGameFull();
    }
  }
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "\o/";

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  if(game.player == 1)//remove player 1
  {
    database.ref("Player1").remove();
  }
  else if(game.player == 2)//remove player 2
  {
    database.ref("Player2").remove();
  }
  if(game.playingComputer ==1)
  {
    database.ref("Player1").remove();
    database.ref("Player2").remove();
    database.ref("Game").child("Started").set(0);
    database.ref("Game").child("Go").set(0);
  }
  if((game.playerHere[0] == null) && (game.playerHere[1] == null))
  {
    database.ref("Game").child("Started").set(0);
    database.ref("Game").child("Go").set(0);
  }
  return confirmationMessage;   //Webkit, Safari, Chrome
});


//Chat section

var showChats = function(){
    database.ref("chatObject").on("child_added", function(snapshot) {
      var chat = snapshot.val();
      console.log(chat.chat);

      var newChatLine = "<tr><td>" + chat.chat.sender + ":</td><td>" + chat.chat.message + "</td></tr>";
      $("#displayRow").prepend(newChatLine);
    });
};

$('#chat-btn').on('click', function() {
    var msg = $('#chat-input');
    var chatObj = {
        message: msg.val(),
        sender: game.playerName[game.player-1],
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref("chatObject").push({
      chat: chatObj
    })
    //Clear message input
    msg.val("");
    return false;
});

showChats();
