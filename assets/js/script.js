var apiKey = "f142d21647feca195690187a6be73e98";

var submitBtn = document.getElementById("search-button");
submitBtn.addEventListener('click', function(event) {
    var searchInput = document.getElementById("search-input").value;
    event.preventDefault();
    console.log(searchInput);
    localStorage.setItem("City Name", searchInput);
    getWeatherData();
    var searchForm = document.getElementById("search-form");
    searchForm.reset();
});


function getWeatherData() {
    var cityName = localStorage.getItem("City Name");
    var cityBtn = document.createElement("button");
    cityBtn.textContent = cityName;
    cityBtn.classList.add("btn", "cityBtn");
    cityBtn.setAttribute("value",cityName )
    var citySearches = document.querySelector(".input-group-append");
    citySearches.append(cityBtn);

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

            var forecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            console.log(forecast);

            fetch(forecast)
                .then(function(response) {
                    return response.json();
                }).then(function(data){
                    console.log(data);
                })
        });
}



