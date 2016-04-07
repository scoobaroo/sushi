var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  latitude: Number,
  longitude: Number
});

var Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
