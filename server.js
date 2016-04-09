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

app.post('/api/restaurants/:id/comments', function addComment(req,res){
    var id = req.params.id;
    console.log(req.body);
    db.Restaurant.findById(id, function(err, foundRestaurant) {
      foundRestaurant.comments.push(req.body); // dangerous, in a real app we'd validate the incoming data
      foundRestaurant.save();
      res.status(200).json(foundRestaurant);  // responding with just the song, some APIs may respond with the parent object (Album in this case)
    });
});

app.put('/api/restaurants/:id/comments/:commentId', function deleteComment(req,res){
    var id = req.params.id;
    var commentId = req.params.commentId;
    var commentBody=req.body.body;
    var commentDate=req.body.date;
    console.log(commentBody);
    console.log(commentDate);
    console.log(req.body);
    db.Restaurant.findById(id, function(err, foundRestaurant) {
      for(i=0;i<foundRestaurant.comments.length;i++){
      if (foundRestaurant.comments[i]._id.toString()===commentId){
        foundRestaurant.comments[i].date = commentDate;
        foundRestaurant.comments[i].body = commentBody;
        // console.log(foundRestaurant.comments[i]);
        foundRestaurant.save();
      }
      }
      // db.foundRestaurant.comments.findByIdAndRemove(commentId, removedComment);
    });
});
app.delete('/api/restaurants/:id/comments/:commentId', function deleteComment(req,res){
    var id = req.params.id;
    var commentId = req.params.commentId;
    db.Restaurant.findById(id, function(err, foundRestaurant) {
      console.log(foundRestaurant);
      for(i=0;i<foundRestaurant.comments.length;i++){
      if (foundRestaurant.comments[i]._id.toString()===commentId){
        foundRestaurant.comments[i].remove();
        console.log(foundRestaurant.comments[i]);
        foundRestaurant.save();
      }
      }
      // db.foundRestaurant.comments.findByIdAndRemove(commentId, removedComment);
    });
});

app.post('/api/restaurants', function(req,res){
  var name = req.body.name;
  var location = req.body.location;
  var rating = req.body.rating;
  var body = req.body.comments.body;
  var date = Date();
  console.log(req.body);
  var data={name: name,
            location: [location],
            rating: rating,
            comments: [{date:date,body:body}]};
  // console.log(data);
  db.Restaurant.create(data, function(err, restaurant){
    res.json(restaurant);
  });
});

app.put('/api/restaurants/:id',function(req,res){
  console.log(req.body);
  var id = req.params.id;
  var Rname = req.body.name;
  var lat = req.body.location.latitude;
  var long = req.body.location.longitude;
  var Rrating = req.body.rating;
  console.log(id, Rname, lat, long, Rrating);
  db.Restaurant.findByIdAndUpdate(id,
    { $set: {name:Rname, rating:Rrating, location: [{latitude:lat, longitude:long}],}},
      {new: true}, function(err, datares){
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
