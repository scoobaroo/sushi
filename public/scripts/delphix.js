console.log('delphix.js loaded');
var lat = 36.098592;
var lon = -112.097796;
var api_key = "9Jz6tLIeJ0yY9vjbEUWaH9fsXA930J9hspPchute";
var url = "https://api.nasa.gov/planetary/earth/assets?lon="+lon+"&lat="+lat+"&begin=2016-09-09&api_key="+api_key
var avg_time = 0;
var last_date;

function flyby(latitude,longitude){
  url = "https://api.nasa.gov/planetary/earth/assets?lon="+longitude+"&lat="+latitude+"&begin=2016-09-09&api_key="+api_key
  $.ajax({
    method: "GET",
    url: url,
    success: getSuccess,
    error: onError
  })
}


var date1;
var date2;
function onError(error){
  console.log(error);
}
function getSuccess(data){
  var numberOfTimes = 0;
  var avg_time_total = 0;
  console.log(data.results);
  var first_date = new Number(new Date(data.results[0].date));
  for (var i = 1; i<data.results.length; i++){
    var last = data.results.length-1
    next_date = new Number(new Date(data.results[i].date));
    avg_time = next_date-first_date;
    avg_time_total += avg_time;
    last_date = data.results[last].date;
    numberOfTimes++;
    first_date = next_date;
  }
  console.log(numberOfTimes);
  average_time = avg_time_total/numberOfTimes;
  console.log("average time: " + average_time);
  console.log("last_date in data: " + last_date);
  var date = new Date(last_date);
  var numberdate = new Number(date)
  var newdatenumber = numberdate + average_time;
  var new_date = new Date(newdatenumber);
  console.log("Next date: " + new_date);
}

flyby(lat,lon);
flyby(36,-112);
flyby(37.7937007  ,-122.4039064)
flyby(36 , -34);
