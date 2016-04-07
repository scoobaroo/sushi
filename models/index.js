var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/sushi");

var Restaurant = require('./restaurant');

module.exports.Restaurant = Restaurant;
module.exports.Comment = require('./comment');
module.exports.Location = require('./location');
