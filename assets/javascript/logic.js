//Here is the Leaderboard Sectiom

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyC03R8QUOYM3o7m1v13bxqzkxN2FbioJ8E",
    authDomain: "group-trivia-project.firebaseapp.com",
    databaseURL: "https://group-trivia-project.firebaseio.com",
    projectId: "group-trivia-project",
    storageBucket: "group-trivia-project.appspot.com",
    messagingSenderId: "311617106396"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. This is what happens when the game starts
$("#submitButton").on("click", function(event) {
  event.preventDefault();

  // User Input
  var userName = $("#nameInput").val().trim();
  var userScore =; //This will most likely be replaced by the function that Peter actually makes to track the score
  var userTime =; //This will be captured once the game is finished.
  

  // Creates local object to hold all info
  var newUser = {
    name: userName,
    score: userScore,
    time: userTime,
  };

  // Uploads user data to the database
  database.ref().push(newUser);

  // Logs everything to console
  console.log(newUser.name);
  console.log(newUser.score);
  console.log(newUser.time);

  // Alert
  alert("Your Score is Saved!!!");

  // User Time
  var userTimeScore =; //This will have to use momentjs. We are going to have to subtract the time the user started the game from the time that the user finished the game and that quantity multplied by 1000 to get the seconds.

  // Clears all of the values
  $("#nameInput").val("");
  $("#placeholderScore").val(0);//This is supposed to be reset once the game is completed
  $("#placeholderTime").val(0);//This value will change once the game is restarted
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destInput = childSnapshot.val().score;
  var timeInput = childSnapshot.val().time;

  // User Info
  console.log(userName);
  console.log(userScore);
  console.log(userTime);


  // Add to the leaderboard
  $("#leaderboard-table > tbody").append("<tr><td>" + userName + "</td><td>" + userScore + "</td><td>" +
  userTime + "</td></tr>");
});

//This is the end of the leaderboard code