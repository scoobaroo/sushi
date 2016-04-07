/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


$(document).ready(function() {
  console.log('app.js loaded!');
  $.get('/api/albums').success(function (albums) {
    albums.forEach(function(album) {
      renderAlbum(album);
    });
  });


  $('#album-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/albums', formData, function(album) {
      console.log('album after POST', album);
      renderAlbum(album);  //render the server's response
    });
    $(this).trigger("reset");
  });

  // catch and handle the click on an add song button
  $('#albums').on('click', '.add-song', handleAddSongClick);

  // save song modal save button
  $('#saveSong').on('click', handleNewSongSubmit);
var albumId;
  $('#albums').on('click', '.edit-song', function editSong(e){
      e.preventDefault();
      albumId = $(this).closest('.album').data('album-id');
      var $modal = $('#editSongsModal');
      var $songNameField = $modal.find('#editedSongName');
      var $trackNumberField = $modal.find('#editedTrackNumber');
      var dataToPost = {
        name: $songNameField.val(),
        trackNumber: $trackNumberField.val()
      };
      $.ajax({
        method: 'GET',
        url: '/api/albums/'+albumId+'/songs',
        success: getSongSuccess,
        error: getSongError
      });
      console.log('retrieved songName:', songName, ' and trackNumber:', trackNumber, ' for album w/ id: ', albumId);
      // POST to SERVER
      $('#editSongsModal').modal('show');
  });
$('#editSongsModal').on('click', '.delete-song', function editSong(e){
      e.preventDefault();
      var songId = $(this).closest('.song-form').data('song-id');
      console.log(songId);
    $.ajax({
      method: 'DELETE',
      url: '/api/albums/'+albumId+'/songs/'+songId,
      success: deleteSongSuccess,
      error: deleteSongError
    });
});
function deleteSongSuccess(json){
  console.log('deleted Song!');
}
function deleteSongError(json){
  console.log('delete song error!');
}
function getSongSuccess(json){
  var songListHtml = $('#songlist').html();
  var songTemplate = Handlebars.compile(songListHtml);
  var songhtml = songTemplate({songsList: json});
  console.log(json);
  $('#editSongsModalBody').append(songhtml);
}

  $('#albums').on('click', '.edit-album', function handleDeleteAlbum(e){
    var albumId = $(this).closest('.album').data('album-id');
    $('.edit-album').html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
    $('.album-name').html('<input type=text id="album-name-edited">');
    $('.artist-name').html('<input type=text id="artist-name-edited">');
    $('.album-releaseDate').html('<input type=text id="releaseDate-edited">');
    $('.songs').html('<input type=text id="songs-edited">');
  });

  $('#albums').on('click', '#saveChanges', function saveChanges(e){
    e.preventDefault();
    var albumId = $(this).closest('.album').data('album-id');
    var editedArtist = $('#artist-name-edited').val();
    var editedAlbum = $('#album-name-edited').val();
    var editedRD = $('#releaseDate-edited').val();
    var editedSongs = $('#songs-edited').val();
    $.ajax({
      method: 'PUT',
      url: 'api/albums/'+albumId,
      data: {name: editedAlbum, artistName: editedArtist, releaseDate: editedRD, songs: editedSongs},
      success: onEditSuccess,
      error: onEditError
    });
  });


  $('#albums').on('click', '.delete-album', function handleDeleteAlbum(e){
    console.log('delete album clicked');
    console.log($(this).closest('.album').data('album-id'));
    var albumId = $(this).closest('.album').data('album-id');
    $.ajax({
      method: 'DELETE',
      url: '/api/albums/'+albumId,
      success: deleteAlbumSuccess,
      error: deleteAlbumError
    });
  });
});

function onEditSuccess(album){
  console.log("edit success!");
  console.log(album.name);
  $('.album-name').text(album.name);
  $('.artist-name').text(album.artistName);
  $('.album-releaseDate').text(album.releaseDate);
  $('.songs').text(album.songs);
}
function onEditError(json){
  console.log('edit Error');
  console.log(json);
}
function deleteAlbumSuccess(json){
  console.log('deleted Album!');
}
function deleteAlbumError(json){
  console.log('error'+json);
}

// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album', album);
  var albumHtml = $('#album-template').html();
  var albumsTemplate = Handlebars.compile(albumHtml);
  var html = albumsTemplate(album);
  $('#albums').prepend(html);
}

function getSongError(json){
  console.log(json);
}
// when the add song button is clicked, display the modal
function handleAddSongClick(e) {
  console.log('add-song clicked!');
  var currentAlbumId = $(this).closest('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
  console.log('id',currentAlbumId);
  $('#songModal').data('album-id', currentAlbumId);
  $('#songModal').modal();  // display the modal!
}

// when the song modal submit button is clicked:
function handleNewSongSubmit(e) {
  e.preventDefault();
  var $modal = $('#songModal');
  var $songNameField = $modal.find('#songName');
  var $trackNumberField = $modal.find('#trackNumber');

  // get data from modal fields
  // note the server expects the keys to be 'name', 'trackNumber' so we use those.
  var dataToPost = {
    name: $songNameField.val(),
    trackNumber: $trackNumberField.val()
  };
  var albumId = $modal.data('albumId');
  console.log('retrieved songName:', songName, ' and trackNumber:', trackNumber, ' for album w/ id: ', albumId);
  // POST to SERVER
  var songPostToServerUrl = '/api/albums/'+ albumId + '/songs';
  $.post(songPostToServerUrl, dataToPost, function(data) {
    console.log('received data from post to /songs:', data);
    // clear form
    $songNameField.val('');
    $trackNumberField.val('');

    // close modal
    $modal.modal('hide');
    // update the correct album to show the new song
    $.get('/api/albums/' + albumId, function(data) {
      // remove the current instance of the album from the page
      $('[data-album-id=' + albumId + ']').remove();
      // re-render it with the new album data (including songs)
      renderAlbum(data);
    });
  }).error(function(err) {
    console.log('post to /api/albums/:albumId/songs resulted in error', err);
  });
}
