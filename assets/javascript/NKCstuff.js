// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAlek3UYzBrLz_TB0nYZqepVApQc46ylSs",
    authDomain: "secondproject-ea01f.firebaseapp.com",
    databaseURL: "https://secondproject-ea01f.firebaseio.com",
    projectId: "secondproject-ea01f",
    storageBucket: "secondproject-ea01f.appspot.com",
    messagingSenderId: "716114012968"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//This section is the initial JS file from Nicole

$(document).ready(function() {

var numPlayers = 0;

var player = {
  name: '',
  wins: 0,
  losses: 0,
  time: 0
  };



var categoryOne = {
  name: 'Science & Nature',
  categoryNum: 17,
  image: './assets/images/science.jpg',
  initialQuestion: 0
};

var categoryTwo = {
  name: 'Sports',
  categoryNum: 21,
  image: './assets/images/sports.jpg',
  initialQuestion: 0
};

var categoryThree = {
  name: 'Geography',
  categoryNum: 22,
  image: './assets/images/geography.jpg',
  initialQuestion: 0
};

var categoryFour = {
  name: 'History',
  categoryNum: 23,
  image: './assets/images/history.jpg',
  initialQuestion: 0
};

var categoryFive = {
  name: 'Celebrities',
  categoryNum: 26,
  image: './assets/images/celebrities.jpg',
  initialQuestion: 0
};

var categorySix = {
  name: 'Art',
  categorynum: 25,
  image: './assets/images/art.jpg',
  initialQuestion: 0
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

//Continuing Nicole's Code
$(document).on('click', '.comp-div', checkNumOfPlayers);

$(document).on('click', '.topic-button', getQuestions);


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
    topicBtn.attr('data-num', categories[i].categoryNum);
    topicBtn.css('background-image', 'url(' + categories[i].image + ')');
    topicBtn.text(categories[i].name);
    $('.button-group').append(topicBtn);

  }
}

function getQuestions() {
  var findTopic = $(this).attr('data-num');
  console.log(findTopic);
  $.ajax(
      {
      url: 'https://opentdb.com/api.php?amount=10&category=' + findTopic + '&difficulty=medium&type=multiple',
      method: 'GET',
    }).done(function(response) 
    {
      console.log(response);
      // looping through results and log
      /*database.ref("Game").child("questions").remove();
      for (var i = 0; i < response.results.length; i++) 
      {
        game.loadQuestions(response.results[i],i);
      }*/
      $('#content').html('');
      $('.button-group').hide();
      var questionDiv = $('<div class="question-div">');
      questionDiv.html(response.results[0].question);
      $('#content').append(questionDiv);

      //set up responses
      var results = response.results[0];
      var option1 = results.correct_answer;
      var option2 = results.incorrect_answers[0];
      var option3 = results.incorrect_answers[1];
      var option4 = results.incorrect_answers[2];

      var optionArr = [option1, option2, option3, option4];

      console.log(optionArr);
      
      //randomize responses
      
      
     
        /*for (var i = 0; i < answerArr.length; i++) {
          var answerDiv = $('<div class="answer-div">');
          answerDiv.attr('data-name', answerArr[i]);
          answerDiv.html(answerArr[i]);
          questionDiv.append(answerDiv);
        }
      }*/
    });
}


  


});