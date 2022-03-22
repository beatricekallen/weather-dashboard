var cityInputEl = document.querySelector("#city-input");
var cityNameEl = document.querySelector("#city-name");
var cityDateEl = document.querySelector("#city-date");
var cityWeatherIconEl = document.querySelector("#weather-icon");
var cityWeatherTempEl = document.querySelector("#city-temp");
var cityHumidityEl = document.querySelector("#city-humidity");
var cityWindSpeedEl = document.querySelector("#wind-speed");
var cityUvIndexEl = document.querySelector("#uv-index");
var cityContainerEl = document.querySelector("#city-container-current");
var submitButtonEl = document.querySelector("#button");
var forecastContainerEl = document.querySelector("#forecast");
var forecastContainerHeadingEl = document.querySelector("#forecast-heading");
var searchHistoryButtonsEl = document.querySelector(".btn-secondary");
var citiesArray = [];

// form handler function: needs to prevent default and run getWeather function on submission
var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getCityCoord(city);
    cityInputEl.value = "";
  } else {
    alert("Please enter a city name.");
  }
  storeCities(city);
  loadCities();
};

// getCityName function: needs to convert city name into coordinates
var getCityCoord = function (city) {
  var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a0c2e4175139a11ef4d0913ba3bef922`;

  fetch(geoApiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);
          lat = data[0].lat;
          long = data[0].lon;
          cityNameEl.textContent = data[0].name;
          getWeather(lat, long);
        });
      } else {
        alert("Error: City not found.");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server.");
    });
};

// getWeather function: needs to get info from the API based on user input city name
var getWeather = function (latitude, longitude) {
  var cityApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=a0c2e4175139a11ef4d0913ba3bef922&units=imperial`;

  fetch(cityApiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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

// displayWeather function: needs to display info from the API call to the page. Needs to display current conditions as well as five-day forecast (or should this be separate function?)
var displayWeather = function (data) {
  console.log(data);
  forecastContainerEl.textContent = "";

  var utcDate = parseInt(data.current.dt) + parseInt(data.timezone_offset);

  cityDateEl.textContent = new Date(parseInt(utcDate));
  cityWeatherIconEl.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'/>`;
  cityWeatherTempEl.textContent = `Current temperature: ${data.current.temp}°F`;
  cityHumidityEl.textContent = `Current humidity: ${data.current.humidity}%`;
  cityWindSpeedEl.textContent = `Current windspeed: ${data.current.wind_speed} mph`;
  cityUvIndexEl.textContent = `Current UV index: ${data.current.uvi}`;

  if (data.current.uvi <= 4) {
    cityUvIndexEl.setAttribute("class", "uv-low");
  } else if (data.current.uvi <= 7) {
    cityUvIndexEl.setAttribute("class", "uv-moderate");
  } else cityUvIndexEl.setAttribute("class", "uv-high");

  forecastContainerHeadingEl.textContent = "5-Day Forecast";

  for (var i = 0; i < 5; i++) {
    var forecastUtcDate = data.daily[i].dt;
    var forecastDayEl = document.createElement("div");
    var forecastDateEl = document.createElement("p");
    var forecastIconEl = document.createElement("p");
    var forecastTempEl = document.createElement("p");
    var forecastWindSpeedEl = document.createElement("p");
    var forecastHumidityEl = document.createElement("p");

    forecastDateEl.textContent = Date(forecastUtcDate);
    forecastIconEl.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'/>`;
    forecastTempEl.textContent = `Temp: ${data.daily[i].temp.day}°F`;
    forecastWindSpeedEl.textContent = `Windspeed: ${data.daily[i].wind_speed} mph`;
    forecastHumidityEl.textContent = `UV index: ${data.daily[i].humidity}%`;

    forecastDayEl.setAttribute("class", "forecast-days");

    forecastDayEl.appendChild(forecastDateEl);
    forecastDayEl.appendChild(forecastIconEl);
    forecastDayEl.appendChild(forecastTempEl);
    forecastDayEl.appendChild(forecastWindSpeedEl);
    forecastDayEl.appendChild(forecastHumidityEl);
    forecastContainerEl.appendChild(forecastDayEl);
  }
};

// storeCities function: needs to save search history to local storage
var storeCities = function (city) {
  citiesArray = JSON.parse(localStorage.getItem("search-history")) || [];
  citiesArray.push(city);
  localStorage.setItem("search-history", JSON.stringify(citiesArray));
};

var loadCities = function () {
  var storedCities = JSON.parse(localStorage.getItem("search-history"));

  for (var i = 0; i < storedCities.length; i++) {
    var searchHistoryButtonEl = document.createElement("button");
    searchHistoryButtonEl.textContent = storedCities[i];
    var searchHistoryContainerEl = document.querySelector("#search-history");
    searchHistoryButtonEl.setAttribute("data-search", storedCities[i]);
    searchHistoryButtonEl.setAttribute(
      "class",
      "btn btn-secondary btn-block p-2"
    );
    searchHistoryButtonEl.setAttribute("type", "submit");
    searchHistoryButtonEl.setAttribute("id", "search-history-button");
    searchHistoryContainerEl.appendChild(searchHistoryButtonEl);
  }
};

$(document).ready(loadCities);

//event listener for submit form
submitButtonEl.addEventListener("click", formSubmitHandler);

document
  .querySelector("#search-history")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var city = event.target.dataset.search;
    console.log(city);
    getCityCoord(city);
  });
