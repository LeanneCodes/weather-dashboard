var apiKey = "f142d21647feca195690187a6be73e98";

// user inputs a city name and then clicks the search button
// the getWeatherData() is called
// the input field is cleared after each search
var submitBtn = document.getElementById("search-button");
submitBtn.addEventListener('click', function(event) {
    var searchInput = document.getElementById("search-input").value;
    event.preventDefault();
    console.log(searchInput);

    if (searchInput !== "") {
        localStorage.setItem("City Name", searchInput);
        getWeatherData();
        
        var searchForm = document.getElementById("search-form");
        searchForm.reset();
    } else {
        submitBtn.setAttribute("disabled", "disabled");
        alert("Please enter a valid city name.");
        location.reload();
    }
    
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

function getWeatherData() {
    var cityName = localStorage.getItem("City Name");
    var cityBtn = document.createElement("button");
    cityBtn.textContent = cityName;
    cityBtn.classList.add("btn", "cityBtn");
    cityBtn.setAttribute("value", cityName);
    
    searchHistory.append(cityBtn);

    console.log(cityName);

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
                        date: dayjs().$d,
                        city: data.name,
                        icon: data.weather[0].icon,
                        temperature: data.main.temp,
                        wind: data.wind.speed,
                        humidity: data.main.humidity
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
                            date: data.list[0].dt_txt,
                            icon: data.list[0].weather[0].icon,
                            temperature: data.list[0].main.temp,
                            wind: data.list[0].wind.speed,
                            humidity: data.list[0].main.humidity
                        },
                        day2: {
                            date: data.list[8].dt_txt,
                            icon: data.list[8].weather[0].icon,
                            temperature: data.list[8].main.temp,
                            wind: data.list[8].wind.speed,
                            humidity: data.list[8].main.humidity
                        },
                        day3: {
                            date: data.list[16].dt_txt,
                            icon: data.list[16].weather[0].icon,
                            temperature: data.list[16].main.temp,
                            wind: data.list[16].wind.speed,
                            humidity: data.list[16].main.humidity
                        },
                        day4: {
                            date: data.list[24].dt_txt,
                            icon: data.list[24].weather[0].icon,
                            temperature: data.list[24].main.temp,
                            wind: data.list[24].wind.speed,
                            humidity: data.list[24].main.humidity
                        },
                        day5: {
                            date: data.list[32].dt_txt,
                            icon: data.list[32].weather[0].icon,
                            temperature: data.list[32].main.temp,
                            wind: data.list[32].wind.speed,
                            humidity: data.list[32].main.humidity
                        }
                    };

                    localStorage.setItem(cityName + " - 5 Day Forecast", JSON.stringify(fiveDayForecast));
                    console.log(fiveDayForecast);
                })
        });
    
        
};


function displayWeatherData(cityName) {
    var currentCity = cityName;
    console.log(currentCity);

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
    sectionTodayDiv.setAttribute("data-city", currentCity);
    console.log(sectionTodayDiv.dataset.city)
    // var datasetCity = sectionTodayDiv.dataset.city;
    
    todaySection.prepend(sectionTodayDiv);

    // create h1 and p tags for today section
    var todayData = JSON.parse(localStorage.getItem(currentCity));
    console.log(todayData);
    var cityDisplay = document.createElement("h2");
    cityDisplay.textContent = todayData.city + ": (" + todayData.date.slice(0,-14) + ")" + todayData.icon;
    console.log(cityDisplay.textContent);
    sectionTodayDiv.append(cityDisplay);

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
    var forecastData = JSON.parse(localStorage.getItem(currentCity + " - 5 Day Forecast"));
    console.log(forecastData);

    var sectionForecastDiv = document.createElement("div");
    sectionForecastDiv.setAttribute("style", "border: 1px solid black; padding: 20px;");
    sectionForecastDiv.setAttribute("class", "container-fluid");
    sectionForecastDiv.setAttribute("data-city", currentCity);
    forecastSection.prepend(sectionForecastDiv);

    // 5-day forecast title
    var forecastTitle = document.createElement("h3");
    forecastTitle.textContent = "5-Day Forecast:";
    sectionForecastDiv.append(forecastTitle);

    // card container
    var cardContainer = document.createElement("div");
    cardContainer.setAttribute("class", "row");
    cardContainer.setAttribute("style", "border: 1px solid blue");
    sectionForecastDiv.appendChild(cardContainer);

    // convert the forecast day one data into an array
    var forecastArray = Object.values(forecastData);
    console.log(forecastArray);

    for (var i = 0; i < forecastArray.length; i++) {
        var divEl = document.createElement("div");
        divEl.setAttribute("class", "col");
        divEl.setAttribute("style", "border: 1px solid green");
        cardContainer.append(divEl);

        var cardDate = document.createElement("h4");
        cardDate.textContent = forecastArray[i].date.slice(0,-9);
        console.log(cardDate);
        divEl.append(cardDate);

        var cardIcon = document.createElement("p");
        cardIcon.textContent = forecastArray[i].icon;
        divEl.append(cardIcon);

        var tempData = document.createElement("p");
        tempData.textContent = "Temp: " + forecastArray[i].temperature;
        divEl.append(tempData);

        var windData = document.createElement("p");
        windData.textContent = "Wind Speed: " + forecastArray[i].wind;
        divEl.append(windData);

        var humidityData = document.createElement("p");
        humidityData.textContent = "Humidity: " + forecastArray[i].humidity;
        divEl.append(humidityData);
    };
};

