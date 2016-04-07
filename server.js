// SERVER-SIDE JAVASCRIPT
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/vendor', express.static(__dirname + '/bower_components'));

var db = require('./models');
/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */
app.get('/api', function index(req, res) {
  res.json({
    message: "Welcome to Sushi Spot",
    documentation_url: "https://github.com/scoobaroo/readme.md",
    base_url: "https://herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
  });

app.get('/api/restaurants', function(req,res){
  db.Restaurant.find({}, function(err, allRestaurants) {
    res.json(allRestaurants);
  });
});

app.post('/api/restaurants', function(req,res){
  var name = req.body.name;
  var location = req.body.location;
  var rating = req.body.rating;
  var comments = req.body.comments;
  console.log(name,location,rating,comments);
  db.Restaurant.create({name: name,
                        location: location,
                        rating: rating,
                        comments: comments},
  function(err, restaurant){
    res.json(restaurant);
  });
});
/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
