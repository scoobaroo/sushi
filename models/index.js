var mongoose = require("mongoose");

mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  'mongodb://localhost/sushi' );

var Restaurant = require('./restaurant');

module.exports.Restaurant = Restaurant;
module.exports.Comment = require('./comment');
module.exports.Location = require('./location');
