// when the window loads, previous stored weather data and buttons appear on screen
document.addEventListener("DOMContentLoaded", function() {
    var recentWeatherData = localStorage.getItem("City Name");

    if (recentWeatherData) {
        getWeatherData(recentWeatherData);
    };
});


var apiKey = "f142d21647feca195690187a6be73e98";

// user inputs a city name and then clicks the search button
// the getWeatherData() is called
// the input field is cleared after each search
var submitBtn = document.getElementById("search-button");
submitBtn.addEventListener('click', function(event) {
    var searchInput = document.getElementById("search-input").value;
    var searchForm = document.getElementById("search-form");
    searchForm.reset();
    event.preventDefault();
    console.log(searchInput);
    


    if (searchInput !== "") {
        localStorage.setItem("City Name", searchInput);
        createButton(searchInput);
        getWeatherData(searchInput);
        displayWeatherData(searchInput);
        
    } else {
        submitBtn.setAttribute("disabled", "disabled");
        alert("Please enter a valid city name.");
        location.reload();
    };
});


/*
    The city name is retrieved from local storage and stored as a variable.
    A new button is created for each city name and is appended to the dashboard.
    Two fetch queries run so that we can retrieve information that we want from
    each city.
    Both current weather and 5 day forecast weather is retrieved for each city call
    and the data is stored in local storage.
*/
var searchHistory = document.getElementById("history");
searchHistory.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(event.target.textContent);
    var clickedCityName = event.target.textContent;
    displayWeatherData(clickedCityName);
});


// only create a new button if it doesn't currently exist
function createButton(cityName) {
    if (!document.querySelector(`.cityBtn[value="${cityName}"]`)) {
        var cityBtn = document.createElement("button");
        cityBtn.textContent = cityName;
        cityBtn.classList.add("btn", "cityBtn", "btn-secondary");
        cityBtn.setAttribute("value", cityName);
        searchHistory.append(cityBtn);
        console.log(cityName);
    }
};


// displays the button if it doesn't have City Name or 5 Day Forecase appended to it
function displayButtons() {
    var cities = Object.keys(localStorage);
    cities.forEach(function(city) {
        if (city !== "City Name" && !city.includes(' - 5 Day Forecast')) {
            createButton(city);
        }
    })
}


// fetches the weather data using the city name and api key first
// then creates variables for lat and lon using the first query data
// then passes those variables into the openweathermap url to get today's data
// and then we call the 5 day forecast api using the same lat and lon values for that city
// both sets of data are stored in objects and saved to local storage
function getWeatherData(cityName) {
    var geoQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    console.log(geoQuery);

    fetch(geoQuery)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);

            var lat = data[0].lat;
            console.log(lat);

            var lon = data[0].lon;
            console.log(lon);

            var cityName = data[0].name;
            console.log(cityName);

            var currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            fetch(currentWeather)
                .then(function(response) {
                    return response.json();
                }).then(function(data) {
                    console.log(data);

                    var today = {
                        date: dayjs(),
                        city: data.name,
                        icon: data.weather[0].icon,
                        temperature: (data.main.temp - 273.15).toFixed(2) + ' °C',
                        wind: (data.wind.speed * 2.23294).toFixed(0) + ' mph', // returns the mph
                        humidity: data.main.humidity + "%"
                    };
                    
                    localStorage.setItem(cityName, JSON.stringify(today));
                    console.log(today);
                });

            var forecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            console.log(forecast);

            fetch(forecast)
                .then(function(response) {
                    return response.json();
                }).then(function(data){
                    console.log(data);

                    var fiveDayForecast = {
                        day1: {
                            date: data.list[4].dt_txt,
                            icon: data.list[4].weather[0].icon,
                            temperature: data.list[4].main.temp,
                            wind: data.list[4].wind.speed,
                            humidity: data.list[4].main.humidity
                        },
                        day2: {
                            date: data.list[12].dt_txt,
                            icon: data.list[12].weather[0].icon,
                            temperature: data.list[12].main.temp,
                            wind: data.list[12].wind.speed,
                            humidity: data.list[12].main.humidity
                        },
                        day3: {
                            date: data.list[20].dt_txt,
                            icon: data.list[20].weather[0].icon,
                            temperature: data.list[20].main.temp,
                            wind: data.list[20].wind.speed,
                            humidity: data.list[20].main.humidity
                        },
                        day4: {
                            date: data.list[28].dt_txt,
                            icon: data.list[28].weather[0].icon,
                            temperature: data.list[28].main.temp,
                            wind: data.list[28].wind.speed,
                            humidity: data.list[28].main.humidity
                        },
                        day5: {
                            date: data.list[36].dt_txt,
                            icon: data.list[36].weather[0].icon,
                            temperature: data.list[36].main.temp,
                            wind: data.list[36].wind.speed,
                            humidity: data.list[36].main.humidity
                        }
                    };

                    localStorage.setItem(cityName + " - 5 Day Forecast", JSON.stringify(fiveDayForecast));
                    console.log(fiveDayForecast);
                })
                .then(function() {
                    displayWeatherData(cityName);
                })
        });

};


// display data on screen using DOM manipulation
function displayWeatherData(cityName) {
    // create the two weather sections of the dashboard
    var todaySection = document.getElementById("today");
    var forecastSection = document.getElementById("forecast");

    // clear existing content within the prebuilt sections
    todaySection.innerHTML = "";
    forecastSection.innerHTML = "";

    // create div for the today section
    var sectionTodayDiv = document.createElement("div");
    sectionTodayDiv.setAttribute("style", "border: 1px solid black; padding: 20px;");
    sectionTodayDiv.setAttribute("class", "container-fluid");
    sectionTodayDiv.setAttribute("data-city", cityName);
    console.log(sectionTodayDiv.dataset.city);
    todaySection.prepend(sectionTodayDiv);

    // create h1 and p tags for today section
    var todayData = JSON.parse(localStorage.getItem(cityName));
    console.log(todayData);

    var cityDisplay = document.createElement("h2");
    cityDisplay.textContent = todayData.city + " (" + todayData.date.slice(0,-14) + ")";
    console.log(cityDisplay.textContent);
    sectionTodayDiv.append(cityDisplay);

    // create an img tag dynamically for the weather icon
    var iconImg = document.createElement("img");
    iconImg.src = `http://openweathermap.org/img/wn/${todayData.icon}.png`;
    iconImg.alt = "Weather Icon";
    sectionTodayDiv.append(iconImg);

    var tempData = document.createElement("p");
    tempData.textContent = "Temp: " + todayData.temperature;
    sectionTodayDiv.append(tempData);

    var windData = document.createElement("p");
    windData.textContent = "Wind Speed: " + todayData.wind;
    sectionTodayDiv.append(windData);

    var humidityData = document.createElement("p");
    humidityData.textContent = "Humidity: " + todayData.humidity;
    sectionTodayDiv.append(humidityData);

    // create the div for the forecast section
    var forecastData = JSON.parse(localStorage.getItem(cityName + " - 5 Day Forecast"));
    console.log(forecastData);

    var sectionForecastDiv = document.createElement("div");
    sectionForecastDiv.setAttribute("style", "padding: 15px;");
    sectionForecastDiv.setAttribute("class", "container-fluid");
    sectionForecastDiv.setAttribute("data-city", cityName);
    forecastSection.prepend(sectionForecastDiv);

    // 5-day forecast title
    var forecastTitle = document.createElement("h3");
    forecastTitle.textContent = "5-Day Forecast:";
    sectionForecastDiv.append(forecastTitle);

    // card container
    var cardContainer = document.createElement("div");
    cardContainer.setAttribute("class", "row");
    sectionForecastDiv.appendChild(cardContainer);

    // convert the forecast day one data into an array
    var forecastArray = Object.values(forecastData);
    console.log(forecastArray);

    // iterate through the array and append the values on screen dynamically
    for (var i = 0; i < forecastArray.length; i++) {
        var divEl = document.createElement("div");
        divEl.setAttribute("class", "col weather-card");
        cardContainer.append(divEl);

        var cardDate = document.createElement("h5");
        cardDate.textContent = forecastArray[i].date.slice(0,-9);
        console.log(cardDate);
        divEl.append(cardDate);

        var cardIcon = document.createElement("img");
        cardIcon.src = `http://openweathermap.org/img/wn/${forecastArray[i].icon}.png`;
        cardIcon.alt = "Weather Icon";
        divEl.append(cardIcon);

        var tempData = document.createElement("p");
        tempData.textContent = "Temp: " + (forecastArray[i].temperature - 273.15).toFixed(2) + ' °C';
        divEl.append(tempData);

        var windData = document.createElement("p");
        windData.textContent = "Wind Speed: " + (forecastArray[i].wind).toFixed(0) + ' mph';
        divEl.append(windData);

        var humidityData = document.createElement("p");
        humidityData.textContent = "Humidity: " + forecastArray[i].humidity + "%";
        divEl.append(humidityData);
    };

    displayButtons(); // buttons are created and displayed after every search
};