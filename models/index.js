var mongoose = require("mongoose");

mongoose.connect( process.env.MONGODB_URI ||
                  'mongodb://localhost/sushi' );

var Restaurant = require('./restaurant');

module.exports.Restaurant = Restaurant;
module.exports.Comment = require('./comment');
module.exports.Location = require('./location');
