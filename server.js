// SERVER-SIDE JAVASCRIPT
//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var bodyParser = require('body-parser');
// serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
// We'll serve jQuery and bootstrap from a local bower cache avoiding CDNs
// We're placing these under /vendor to differentiate them from our own assets
app.use('/vendor', express.static(__dirname + '/bower_components'));
var controllers = require('./controllers');
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

app.get('/api', controllers.api.index);
app.get('/api/albums', controllers.albums.index);
app.get('/api/albums/:albumId', controllers.albums.show);
app.post('/api/albums', controllers.albums.create);
app.post('/api/albums/:albumId/songs', controllers.albumsSongs.create);

app.delete('/api/albums/:albumId/songs/:songId', function deleteSong(req,res){
  db.Album.findById(req.params.albumId, function(err,foundAlbum) {
    console.log(foundAlbum.songs.id(req.params.songId));
      foundAlbum.songs.remove({_id:req.params.songId});
    });
});

app.get('/api/albums/:albumId/songs', function getSongs(req,res){
    var albumId = req.params.albumId;
    db.Album.findById(req.params.albumId, function(err, foundAlbum) {
      console.log(foundAlbum);
      var songList = foundAlbum.songs;
      console.log(songList); // dangerous, in a real app we'd validate the incoming data
      res.json(songList);  // responding with just the song, some APIs may respond with the parent object (Album in this case)
    });
});

app.put('/api/albums/:albumId', function editAlbum(req,res){
  console.log(req.params);
  var albumId = req.params.albumId;
  var editedAlbumName = req.body.name;
  var editedArtistName = req.body.artistName;
  var editedRD = req.body.releaseDate;
  var editedSongs = req.body.songs;
  console.log(albumId, editedAlbumName, editedArtistName, editedRD, editedSongs);
  db.Album.findByIdAndUpdate(albumId, {name:editedAlbumName,
                                      artistName:editedArtistName,
                                      releaseDate:editedRD,
                                      songs:editedSongs},  {new: true}, function(err, datares){
    if(err){
      console.log(err);
      res.status(500).json(err);
      }
    else
      console.log(datares);
      res.status(200).json(datares);
    });
});

app.delete('/api/albums/:albumId' ,function deleteAlbum (req,res){
  var albumId = req.params.albumId;
  db.Album.findByIdAndRemove(albumId, function(err, datares){
    if(err){
      console.log(err);
      }
    else
      console.log(datares);
    });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
