var cityInputEl = document.querySelector("#city-input");
var cityNameEl = document.querySelector("#city-name");
var cityDateEl = document.querySelector("#city-date");
var cityWeatherIconEl = document.querySelector("#weather-icon");
var cityWeatherTempEl = document.querySelector("#city-temp");
var cityHumidityEl = document.querySelector("#city-humidity");
var cityWindSpeed = document.querySelector("#wind-speed");
var cityUvIndex = document.querySelector("#uv-index");
var cityContainerEl = document.querySelector("#city-container-current");
var submitButtonEl = document.querySelector("#button");
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
};

// getCityName function: needs to convert city name into coordinates
var getCityCoord = function (city) {
  var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a0c2e4175139a11ef4d0913ba3bef922`;

  fetch(geoApiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
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
  var cityApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=a0c2e4175139a11ef4d0913ba3bef922`;

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
  console.log(cityDateEl);
  // for (var i = 0; i < data.length; i++) {
  // cityContainerEl.textContent = "";

  cityDateEl.textContent = data.current.dt;
  cityWeatherIconEl.textContent = data.current.weather.icon;
  cityWeatherTempEl.textContent = data.current.temp;
  cityHumidityEl.textContent = data.current.humidity;
  cityWindSpeed.textContent = data.current.wind_speed;
  cityUvIndex.textContent = data.current.uvi;
};
// };

// storeCities function: needs to save search history to local storage
var storeCities = function (city) {
  console.log(city);
  citiesArray = JSON.parse(localStorage.getItem("search-history")) || [];
  citiesArray.push(city);
  localStorage.setItem("search-history", JSON.stringify(citiesArray));

  // var newCity = {
  //   city: cityInputEl,
  // };

  // var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];
  // citiesArray.push(newCity);
  // var citiesString = JSON.stringify(citiesArray);
  // localStorage.setItem("cities", citiesString);
};

var loadCities = function () {
  var storedCities = JSON.parse(localStorage.getItem("search-history"));

  for (var i = 0; i < storedCities.length; i++) {
    console.log("working");
    var searchHistoryButtonEl = document.createElement("button");
    searchHistoryButtonEl.textContent = storedCities[i];
    var searchHistoryContainerEl = document.querySelector("#search-history");
    searchHistoryButtonEl.setAttribute("data-search", storedCities[i]);
    searchHistoryContainerEl.appendChild(searchHistoryButtonEl);
  }
};

loadCities();

//event listener for submit form
submitButtonEl.addEventListener("click", formSubmitHandler);
