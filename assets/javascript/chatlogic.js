var config = {
    apiKey: "AIzaSyB5KS-tKYV2moQ3ybGPx_DA7x3wl820W6E",
    authDomain: "group2-trivia.firebaseapp.com",
    databaseURL: "https://group2-trivia.firebaseio.com",
    projectId: "group2-trivia",
    storageBucket: "",
    messagingSenderId: "612552051599"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#name-btn').on('click', function(event) {
    event.preventDefault();
    var playerName = $('#player').val().trim();
    
    database.ref().set({
        "name": playerName
    })
});


database.ref().on("child_added", function(snapshot) {

    var newMessage = snapshot.val();

    var messageName = newMessage.name;
    var quickMessage = newMessage.message;

    var row = $("<tr>");
    var html = "<td>" + messageName + "</td>";
        html += "<td>" + quickMessage + "</td>";

    row.html(html);
    $("#displayRow").prepend(row);

    console.log(newMessage);

});



$("#chat-btn").on("click", function(event){
  var userMessage = $("#chat-input").val();

  database.ref().push({
    "message": userMessage
  });
});
