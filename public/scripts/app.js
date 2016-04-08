$(document).ready(function() {
  console.log('app.js loaded!');
  $.get('/api/restaurants').success(function (restaurants) {
    restaurants.forEach(function(restaurant) {
      renderRestaurant(restaurant);
    });
  });
  $('#restaurant-form').on('submit', function(e) {
    e.preventDefault();
    var restaurantname=$("#restaurantname").val();
    var location=$('#location').val();
    var comments=$('#comments').val();
    var rating=$('#rating').val();
    console.log(restaurantname,rating,location,comments);
    $.ajax({
      method: 'POST',
      url: '/api/restaurants',
      data: {name: restaurantname,
            location: location,
            rating: rating,
            comments: comments},
      success: postRestaurantSuccess,
      error: postRestaurantError
    });
    $(this).trigger("reset");
  });
  $('#restaurants').on('click', '.edit-comment', function editComment(e){
      e.preventDefault();
      $('#editCommentModal').modal('show');
      restaurantId = $(this).closest('.restaurant').data('restaurant-id');
      var $modal = $('#editCommentModal');
      var $commentDate = $modal.find('.comment-date');
      var $commentBody = $modal.find('.comment-body');
      var dataToPost = {
        date: $commentDate.val(),
        body: $commentBody.val()
      };
      $.ajax({
        method: 'GET',
        url: '/api/restaurants/'+restaurantId+'/comments',
        success: getCommentSuccess,
        error: getCommentError
      });
      console.log('retrieved commentDate:', $commentDate, ' and commentBody:', $commentBody, ' for restaurant w/ id: ', restaurantId);
      // POST to SERVER
  });
  $('#editCommentModal').on('click', '.delete-comment', function deleteComment(e){
      e.preventDefault();
      var restaurantId = $(this).closest('.restaurant').data('restaurant-id');
      var commentId = $(this).closest('.comment').data('comment-id');
      console.log(commentId);
      $.ajax({
        method: 'DELETE',
        url: '/api/restaurants/'+restaurantId+'/comments/'+commentId,
        success: deleteCommentSuccess,
        error: deleteCommentError
      });
      console.log('deleted Commit with id:', commentId);
      // POST to SERVER
  });

  $("#restaurants").on('click',".delete-restaurant",function(e){
    console.log('sanity check');
    console.log($(this).closest('.restaurant').data('restaurant-id'));
    var restaurantId=$(this).closest('.restaurant').data('restaurant-id');
    $.ajax({
      method:'DELETE',
      url:'api/restaurants/'+restaurantId,
      success:deleteRestaurantSuccess,
      error:deleteRestaurantError
    });
  });
  $("#restaurants").on('click', ".edit-restaurant", function(e){
    console.log('SANITY CHECK');
    e.preventDefault();
    $('.edit-restaurant').html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
    $('.restaurant-name').html('<input type=text id="restaurant-name-edited">');
    $('.location').html('<input type=text id="location-edited">');
    $('.comments').html('<input type=text id="comments-edited">');
    $('.rating').html('<input type=text id="rating-edited">');
  });
  $('#restaurants').on('click', '#saveChanges', function saveChanges(e){
    var restaurantId = $(this).closest('.restaurant').data('restaurant-id');
    var editedRestaurantName = $('#restaurant-name-edited').val();
    var editedLocation = $('#location-edited').val();
    var editedRating = $('#rating-edited').val();
    var editedComments = $('#comments-edited').val();
    console.log(restaurantId,editedRestaurantName,editedLocation,editedRating,editedComments);
    $.ajax({
      method: 'PUT',
      url: 'api/restaurants/'+restaurantId,
      data: {name: editedRestaurantName, location: editedLocation, rating: editedRating, comments: editedComments},
      success: onEditSuccess,
      error: onEditError
    });
  });
});

  $("#restaurants").on('click', ".edit-restaurant", function(e){
    console.log('SANITY CHECK');
    var restaurantId = $(this).closest('.restaurant').data('restaurant-id');
    $('.edit-restaurant').html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
    $('.restaurant-name').html('<input type=text id="restaurant-name-edited">');
    $('.location').html('<input type=text id="artist-name-edited">');
    $('.comments').html('<input type=text id="comments-edited">');
    $('.rating').html('<input type=text id="rating-edited">');
  });

  $('#albums').on('click', '.delete-album', function handleDeleteAlbum(e){
    var albumId = $(this).closest('.album').data('album-id');});

// this function takes a single album and renders it to the page
function renderRestaurant(restaurant) {
  console.log('rendering restaurant', restaurant);
  var restaurantHtml = $('#restaurant-template').html();
  var restaurantTemplate = Handlebars.compile(restaurantHtml);
  var html = restaurantTemplate(restaurant);
  $('#restaurants').prepend(html);
}
function postRestaurantSuccess(json){
  console.log('restaurant after POST', json);
  renderRestaurant(json);  //render the server's response
}
function postRestaurantError(err){
  console.log('err:',err);
}
function deleteRestaurantSuccess(json){
  console.log('restaurant deleted!');
}
function deleteRestaurantError(err){
  console.log('err:',err);
}
function onEditSuccess(json){
  console.log(json);
  renderRestaurant(json);
}
function onEditError(json){
  console.log(json);
}
function getCommentSuccess(json){
  var commentListHtml = $('#commentlist').html();
  var commentTemplate = Handlebars.compile(commentListHtml);
  var commenthtml = commentTemplate({commentList: json});
  $('#editCommentModalBody').html(commenthtml);
  console.log(json);
}
function getCommentError(json){
  console.log(json);
}
