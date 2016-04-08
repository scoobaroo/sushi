var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  latitude: String,
  longitude: String
});

var Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
