$(document).ready(function() {

var numPlayers = 0;

var player = {
	name: '',
	wins: 0,
	losses: 0
	};



var categoryOne = {
	name: 'Science and Nature',
	//link to trivia api
	image: './assets/images/science.jpg'
};

var categoryTwo = {
	name: 'Sports',
	//link to trivia api
	image: './assets/images/sports.jpg'
};

var categoryThree = {
	name: 'Geography',
	//link to trivia api
	image: './assets/images/geography.jpg'
};

var categoryFour = {
	name: 'History',
	//link to trivia api
	image: './assets/images/history.jpg'
};

var categoryFive = {
	name: 'Celebrities',
	//link to trivia api
	image: './assets/images/celebrities.jpg'
};

var categorySix = {
	name: 'Art',
	//link to trivia api
	image: './assets/images/art.jpg'
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

