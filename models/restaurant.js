var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = require('./comment');
var Location = require('./location');

var RestaurantSchema = new Schema({
  name: String,
  location: [Location.schema],
  rating: Number,
  comments: [Comment.schema]
});

var Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;
