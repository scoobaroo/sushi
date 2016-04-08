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
app.get('/api/restaurants/:id/comments', function getComments(req,res){
    var id = req.params.id;
    db.Restaurant.findById(id, function(err, foundRestaurant) {
      console.log(foundRestaurant);
      var commentList = foundRestaurant.comments;
      console.log(commentList); // dangerous, in a real app we'd validate the incoming data
      res.json(commentList);  // responding with just the song, some APIs may respond with the parent object (Album in this case)
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

app.put('/api/restaurants/:id',function(req,res){
  console.log(req.params);
  console.log(req.body);
  var id = req.params.id;
  var Rname = req.params.name;
  var Rlocation = req.params.location;
  var Rrating = req.params.rating;
  var Rcomments = req.params.comments;
  db.Restaurant.findByIdAndUpdate(id, {name:Rname,
    // {$set:
    // {location.latitude:Rlocation, location.longitude=Rlocation},
    // {comments.date=Rcomments, comments.body=Rcomments}
                                                  // },
                                        rating:Rrating},  {new: true}, function(err, datares){
    if(err){
      console.log(err);
      res.status(500).json(err);
      }
    else
      console.log(datares);
      res.status(200).json(datares);
    });
});

app.delete('/api/restaurants/:restaurantId', function(req,res){
  var restaurantId = req.params.restaurantId;
  console.log(restaurantId);
  db.Restaurant.findByIdAndRemove(restaurantId, function(err,deletedRestaurant){
    res.status(200).send('restaurant deleted!');
  });
});
/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
