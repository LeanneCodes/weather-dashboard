var apiKey = "f142d21647feca195690187a6be73e98";
var lat = 51.5073219;
var lon = -0.1276474;
var cityName = "London";
var limit = 1;
var forecast = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
console.log(forecast);
var geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=" + limit + "&appid=" + apiKey;
console.log(geoQuery);