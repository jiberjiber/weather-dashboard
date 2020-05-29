// JavaScript Document

const iconSunny = $('<i class="fas fa-sun"></i>');
const iconCloudy = $('<i class="fas fa-cloud"></i>');
const iconPartlyCloudy = $('<i class="fas fa-cloud-sun"></i>');
const iconShowers = $('<i class="fas fa-cloud-showers-heavy"></i>');
const iconRain = $('<i class="fas fa-cloud-rain"></i>');

// Left side UI components
const searchInput = $('#searchInput');
const searchButton = $('#searchButton');
const recents = $('#searchHistory');

// Right side UI components
const responseTarget = $('#responseTarget');


// Back end components
var requestedCity = '';


function beginQuery(e){
	e.preventDefault();
	
	requestedCity = searchInput.val().trim();
	searchInput.val('');
	
	var newBtn = $('<button>');
	var btnTxt = $('<span>');
	newBtn.addClass('list-group-item');
	btnTxt.text(requestedCity);
	newBtn.append(btnTxt);
	recents.prepend(newBtn);
	
	console.log(requestedCity);
	
	getCurrentWeather(requestedCity);
	getForecast(requestedCity);
}

function getCurrentWeather(city){
	var queryURL = 'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=69b374abd881e0694b55c1e948ba80d1';
}

function getForecast(city){
	
}



searchButton.on('click',beginQuery);
searchInput.on('submit',beginQuery);