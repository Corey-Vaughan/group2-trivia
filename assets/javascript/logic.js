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

var database = firebase.database();

//This section is the initial JS file from Nicole

$(document).ready(function() {

var numPlayers = 0;

var player = {
  name: '',
  wins: 0,
  losses: 0
  };



var categoryOne = {
  name: 'Science & Nature',
  catergoryNum: 17,
  image: './assets/images/science.jpg',
};

var categoryTwo = {
  name: 'Sports',
  catergoryNum: 21,
  image: './assets/images/sports.jpg',
};

var categoryThree = {
  name: 'Geography',
  categoryNum: 22,
  image: './assets/images/geography.jpg',
};

var categoryFour = {
  name: 'History',
  categoryNum: 23,
  image: './assets/images/history.jpg',
};

var categoryFive = {
  name: 'Celebrities',
  categoryNum: 26,
  image: './assets/images/celebrities.jpg',
};

var categorySix = {
  name: 'Art',
  catergorynum: 25,
  image: './assets/images/art.jpg',
};

var categories = [categoryOne, categoryTwo, categoryThree, categoryFour, categoryFive, categorySix];



//hide chat log on page load
$('#chat').hide()


$('#name-btn').on('click', function(event) {
  event.preventDefault();
  var playerName = $('#player').val().trim();
  player[name] = playerName;
  $('#player').val('');
  console.log(player[name]);
  $('#chat').show();
  checkNumOfPlayers();
});

//Code from Peter's JS File
var game = 

{//create a game object
    time: 0,
    question: 0,
    timeID: 0,
    player:0,
    categoryList: ["Science & Nature","Sports","Geography","History","Celebrities","Art"],
    categoryNums: [17,21,22,23,26,25],
    category:0,
    categoryName: "None",
    player1Score:0,
    player2Score:0,
    player1Time:0,
    player2Time:0,
    player1Name:"None",
    player2Name:"Not Arrived",
    myDivGameArea: $("#content"),
    myDivTimeRemaining:$("<div/>", {"id": "timeRemaining"}),
    myDivQuestion:$("<div/>", {"id": "questionPic"}),
    myDivAnswer1:$("<div/>", {"class": "answer col-12"}),
    myDivAnswer2:$("<div/>", {"class": "answer col-12"}),
    myDivAnswer3:$("<div/>", {"class": "answer col-12"}),
    myDivAnswer4:$("<div/>", {"class": "answer col-12"}),
    theQuestion:"None",
    answerArray:0,
    answerNum:0,
    startNewGame: function() 
    {//set up the first question and initialize the div and variables
      game.question = 0;
      game.displayQuestions();
  },
  getQuestions: function()
  {
    $.ajax(
      {
      url: 'https://opentdb.com/api.php?amount=10&category=' + game.category + '&difficulty=medium&type=multiple',
      method: 'GET',
    }).done(function(response) 
    {
      //console.log(response);
      // looping through results and log
      database.ref("Game").child("questions").remove();
      for (var i = 0; i < response.results.length; i++) 
      {
        game.loadQuestions(response.results[i],i);
      }
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

//Continuing Nicole's Code
$(document).on('click', '.comp-div', checkNumOfPlayers);


function checkNumOfPlayers() {
  numPlayers++;
  console.log('Number of players: ' + numPlayers);
  if (numPlayers < 2) {
    $('#content').html('Waiting on second player...').css('font-weight', 'bold');
    compBtn = $('<button class="comp-div center-block">');
    compBtn.html('Or play against the computer');
    $('#content').append(compBtn);
  } else {
  displayCategories();
  }
}

function displayCategories() {
  $('#content').html('Pick your topic:').css('font-weight', 'bold');
  var btnGroup = ('<div class="button-group center-block">');
  $('#content').append(btnGroup);

  for (var i = 0; i < categories.length; i++) {
    var topicBtn = $('<div class="topic-button center-block">');
    topicBtn.attr('data-name', categories[i].name);
    topicBtn.css('background-image', 'url(' + categories[i].image + ')');
    topicBtn.text(categories[i].name);
    $('.button-group').append(topicBtn);

  }
}

});

    game.shallWePlay();
  },
  shallWePlay: function()//waiting for player 2 or just start the game
  {
    game.myDivGameArea.empty();//clear out my div and add the category buttons
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>The Category is: " + game.categoryName +" </h4></div>");
    game.myDivGameArea.append("<div><h5 class='text-center' id = 'player1Name'>Player 1: " + game.player1Name  +" </h5></div>");
    game.myDivGameArea.append("<div><h5 class='text-center' id = 'player2Name'>Player 2: " + game.player2Name +" </h5></div>");
    var myButton = $("<button/>", {"id": "startTheGame"});
    myButton.text("Start")
    game.myDivGameArea.append(myButton);
  },
  getPlayerName: function()//prompt for the player name
  {          
    game.myDivGameArea.empty();       
    game.myDivGameArea.append('Enter your name to begin:<br><form name="message" action=""> Player Name: <input name="usermsg" type="text" id="userName" class="col-8"/><input name="submitName" type="submit"  id="submitName" value="Send" /></form></div></div>')
  },
  displayCategories: function()
  {
    game.myDivGameArea.empty();//clear out my div and add the category buttons
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>Please choose a category:</h4></div>");
    $(game.categoryList).each(function(index,item)
      {
        //display the categories
        var newDiv = $("<button/>", {"class": "categoryChoice col-12"});
        newDiv.attr("data-c",game.categoryNums[index]);
        newDiv.attr("data-n",item);
        game.myDivGameArea.append(newDiv.text(item));
      });
  },
  displayQuestions: function()
  {
    //alert(snapshot.child("Game").child("question0").child("wrong4").val()[2]);
    database.ref("Game").child('questions').orderByChild('questionNumber').equalTo(5).on("value", function(snapshot) {
        console.log(snapshot.val());
        //console.log(snapshot.question.val());
        snapshot.forEach(function(data) {
                /*console.log(data.key);
                console.log(snapshot.val().question);
                //Try this
            console.log(data.question);*/
            //Or try this
            game.theQuestion = data.val().question;
            //console.log(data.val().theAnswers);
            game.answerArray = data.val().theAnswers;
            game.answerNum = data.val().theAnswer;
            });
        //console.log(snapshot.child("question").val());
    });
    //console.log(game.questions[0]);
    game.myDivGameArea.empty();//clear out my div and add the questions
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'timeRemaining'>Time:</h4></div>");
    game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>" + game.theQuestion +"</h4></div>");
    $(game.answerArray).each(function(index,item)
      {
        //display the categories
        var newDiv = $("<button/>", {"class": "answerChoice col-12"});
        newDiv.attr("data-i",game.categoryNums[index]);
        newDiv.attr("data-n",game.answerNum);
        game.myDivGameArea.append(newDiv.text(item));
      });
  },
  outtaTime: function() 
  {/*//the timer hit zero
      if(game.question < (questions.length -1))
      {
        clearInterval(game.timeID);
        $("#timeRemaining").text("Time Remaining: 0");
        $("#prompt").text("You're outta time! it's: " + pokemon[game.question] + "!");
        $(game.myDivQuestion).html('<img src= '+ questions[game.question].apic +' class ="question rounded mx-auto d-block img-fluid"/>');
        game.clearDiv();
        setTimeout(function(){ game.newQuestion(); }, 4000);
      }
      else
      {
        clearInterval(game.timeID);
        $("#timeRemaining").text("Time Remaining: 0");
        $("#prompt").text("You're outta time! it's: " + pokemon[game.question] + "!");
        $(game.myDivQuestion).html('<img src= '+ questions[game.question].apic +' class ="question rounded mx-auto d-block img-fluid"/>');
        game.clearDiv();
        setTimeout(function(){ game.gameOver(); }, 4000);
      }*/
    },
  count: function(){//count down from a given number of seconds
    if(game.time > 0)
    {

      database.ref("Game").child("timer").set(game.time);//set the timer to 15 seconds
      game.time --
    }
    else
    {
      game.outtaTime();
    }
  },

};

$(document).on("click", "#submitName" , function(event)//enter your name
{ // Prevent form from submitting
    event.preventDefault();
  // Get the input value and send it to the database
  var playerName = $("#userName").val().trim();
  if(playerName.length > 0)
  {
    database.ref("Game").child("player" + game.player + "Name").set(playerName);
    if(game.player == 1)
    {
      game.player1Name = playerName;
      game.displayCategories();
    }
    else if(game.player == 2)
    {
      game.player2Name = playerName;
    }
    $('#userName').val('');
  }
});

$(document).on("click", ".categoryChoice" , function(event)//enter your name
{
  // Get the category choice and get the questions
  // then we wait for player 2 or start the game
  game.category = $(this).data("c");
  game.categoryName = $(this).data("n");
  database.ref("Game").child("Category").set(game.categoryName);
  game.getQuestions();
});

$(document).on("click", "#startTheGame" , function(event)//start the game
{ //create the gameplay div, load question 1 and start the timer
  
    game.time = 15;
    game.timeID = setInterval(function(){ game.count(); }, 1000); 
    game.startNewGame();
});



database.ref("Game/timer").on("value", function(snapshot) //the timer is counting down
{
  game.time = snapshot.val();
  $("#timeRemaining").text("Time Remaining: " + game.time);
});

database.ref().on("value", function(snapshot) //any change on the database triggers this
{
  //listen for changes to the database
  //alert(snapshot.child("Game").child("question0").child("wrong4").val()[2]);
  //game.questions = snapshot.child("Game").child("questions").val();
  //console.log(game.questions);
  if(game.player == 0)//this is our first look at the database
  {
    //Can I be player 1?
      if(snapshot.child("Game").child("player1Here").val() == null)
      {
        //I can be player1
      game.player = 1;
        database.ref("Game").child("player1Here").set("yes");
        if(snapshot.child("Game").child("player2Here").val() == null)
        {
          //there is no player 2
          game.player2Name = "Not arrived";
        }
        else//thre is a player 2 - lets grab the name
        {
          game.player2Name = snapshot.child("Game").child("player2Name").val();
        }
        game.getPlayerName();
      }//i can't be player 1, can I be player 2?
      else if(snapshot.child("Game").child("player2Here").val() == null)
      {
        //I can be player 2
        game.player = 2;
        database.ref("Game").child("player2Here").set("yes");
        if(snapshot.child("Game").child("player1Here").val() == null)
        {
          //there is no player 1
          game.player1Name = "Not arrived";
        }
        else//thre is a player 1 - lets grab the name
        {
          game.player2Name = snapshot.child("Game").child("player1Name").val();
        }
        game.getPlayerName();
      }
      else
      {
        game.myDivGameArea.empty();//clear out my div and add the category buttons
      game.myDivGameArea.append("<div><h4 class='text-center' id = 'prompt'>The Game is already full.  Please come back later.</h4></div>");
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
    database.ref("Game").child("player1Here").remove();
    database.ref("Game").child("player1Name").remove();
  }
  else if(game.player == 2)//remove player 2
  {
    database.ref("Game").child("player2Here").remove();
    database.ref("Game").child("player2Name").remove();
  }
  return confirmationMessage;   //Webkit, Safari, Chrome
});

//Here is John's Leaderboard Section

// This is what happens when the game starts and the user enters their name
$("#name-btn").on("click", function(event) {
  event.preventDefault();

// User Input
  var userName = $("#name-btn").val().trim();

// Creates local object to hold all info
  var newUser = {
    name: userName,
  };

// Uploads user data to the database
  database.ref().push(newUser);

// Logs everything to console
  console.log(newUser.name);
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

// // Store everything into a variable.
  var userName = childSnapshot.val().name;

// // User Info
  console.log(userName);

// // Add to the leaderboard
  $("#achievements > tbody").append("<tr><td>" + userName + "</td></tr>");
});