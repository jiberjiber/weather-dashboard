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
const recentItem = $('#recentItem');

// Right side UI components
const responseTarget = $('#responseTarget');


// Back end components
var requestedCity = '';
if (localStorage.getItem('recents')) {
	var recentsList = JSON.parse(localStorage.getItem('recents'));
} else {
	var recentsList = [];
}
var lat = 0;
var lon = 0;


function renderRecents(city) {
	// console.log('array before:',recentsList);
	recents.empty();

	for (var i = 0; i < recentsList.length; i++) {
		var newBtn = $('<button>');
		var btnTxt = $('<span>');
		newBtn.addClass('list-group-item');
		newBtn.attr('data-city', recentsList[i]);
		newBtn.attr('id', 'recentItem');
		newBtn.attr('onclick', 'beginRecentQuery');
		btnTxt.text(recentsList[i]);
		newBtn.append(btnTxt);
		recents.prepend(newBtn);
	} // console.log('array after:',recentsList);
	
	getCurrentWeather(recentsList[recentsList.length-1]);
	getForecast(recentsList[recentsList.length-1]);
}

function beginQuery(e) {
	e.preventDefault();

	requestedCity = searchInput.val().trim();
	searchInput.val('');

	// console.log('begin-query-city:',requestedCity);
	recentsList.push(requestedCity);
	localStorage.setItem('recents', JSON.stringify(recentsList));
	renderRecents(requestedCity);

	getCurrentWeather(requestedCity);
	getForecast(requestedCity);
}

function beginRecentQuery() {
	var cityName = $(this).attr('data-city');
	getCurrentWeather(cityName);
	getForecast(cityName);
}

function getCurrentWeather(city) {
	var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=69b374abd881e0694b55c1e948ba80d1';

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		//console.log(response);
		//console.log(response.weather[0].main);

		lat = response.coord.lat;
		lon = response.coord.lon;

		var title = $('#currentCity');
		var tempDisplay = $('#currentTemp');
		var humidity = $('#currentHumidity');
		var windspeed = $('#currentWindspeed');

		var tempC = (response.main.temp - 273);
		var tempF = tempC * 9 / 5 + 32;

		title.text(response.name);
		tempDisplay.text('Temperature: ' + Math.ceil(tempC) + 'C/' + Math.ceil(tempF) + 'F');
		humidity.text('Humidity: ' + response.main.humidity + '%');
		windspeed.text('Wind Speed: ' + response.wind.speed + 'mph');

		// ---------------------------------------------------------

		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/uvi?appid=69b374abd881e0694b55c1e948ba80d1&lat=' + lat + '&lon=' + lon,
			method: 'GET',
		}).then(function (UVResponse) {
			var UVIndex = $('#currentUV');
			var UVNum = UVResponse.value;
			UVIndex.text(Math.floor(UVNum));

			if (UVNum >= 0 && UVNum <= 2) {
				UVIndex.addClass('bg-success');
			} else if (UVNum >= 3 && UVNum <= 5) {
				UVIndex.addClass(['bg-warning','text-black-50']);
			} else if (UVNum >= 6) {
				UVIndex.addClass('bg-danger');
			} else {
				console.log('Error: UV index cannot be less than 0');
			}
		});


	});
}

function getForecast(city) {
	$.ajax({
		url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=69b374abd881e0694b55c1e948ba80d1&cnt=5',
		method: "GET"
	}).then(function(response){
		var days = response.list;
		for(var i = 1; i < days.length; i++){
			var date = $('<h4>');
			var icon = $('<p>');
			var tempDisplay = $('<p>');
			var humidity = $('<p>');
			
			var day = $('#day-' + i);
			day.empty();
			
			var tempC = days[i].main.temp - 273;
			var tempF = tempC * 9/5 + 32;
			var temp = Math.ceil(tempC) + 'C/' + Math.ceil(tempF) + 'F';
			
			date.text(days[i].dt_txt);
			tempDisplay.text(temp);
			humidity.text(days[i].main.humidity);
			
			
			
			day.append(date);
			day.append(icon);
			day.append(tempDisplay);
			day.append(humidity);
		}
	});
}


searchButton.on('click', beginQuery);
searchInput.on('submit', beginQuery);
$(document).on('click', '#recentItem', beginRecentQuery);

renderRecents();
