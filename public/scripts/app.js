/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */




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

  $("#restaurants").on('click',".delete-restaurant",function(e){
    console.log('sanity check');
    $.ajax({
      method:'DELETE',
      url:'api/restaurants/:restaurantId',
      success:deleteRestaurantSuccess,
      error:deleteRestaurantError
    });
  });
});

  $('#restaurants').on('click', '.edit-restaurant', function handleDeleteAlbum(e){
    var albumId = $(this).closest('.album').data('album-id');
    $('.edit-restaurant').html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
    $('.restaurant-name').html('<input type=text id="album-name-edited">');
    $('.location').html('<input type=text id="artist-name-edited">');
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
  console.log('restaurant deleted!', json);
}
function deleteRestaurantError(err){
  console.log('err:',err);
}
