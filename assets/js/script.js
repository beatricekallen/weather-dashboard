var cityInputEl = document.querySelector("#city-input");
var cityNameEl = document.querySelector("#city-name");
var cityDateEl = document.querySelector("#city-date");
var cityWeatherIconEl = document.querySelector("#weather-icon");
var cityWeatherTempEl = document.querySelector("#city-temp");
var cityHumidityEl = document.querySelector("#city-humidity");
var cityWindSpeed = document.querySelector("#wind-speed");
var cityUvIndex = document.querySelector("#uv-index");

// form handler function: needs to prevent default and run getWeather function on submission
var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name.");
  }
};

// getWeather function: needs to get info from the API based on user input city name
var getWeather = function (city) {
  var apiURL = fetch(apiURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
        });
      } else {
        alert("Error: City not found.");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server.");
    });
};

// displayWeather function: needs to display info from the API call to the page. Needs to display current conditions as well as five-day forecast
