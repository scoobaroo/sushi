var restaurantId;
var restaurantList;


function initMap() {
  $.ajax({
    method:'GET',
    url: '/api/restaurants',
    success: getRestaurantSuccess,
    error: getRestaurantError
  });
  var myLatLng = {lat: 37.78, lng: -122.44};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom:1,
    center: myLatLng
  });
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
  console.log(restaurantList.length);
  for(i=0;i<restaurantList.length;i++){
    console.log('rla',restaurantList[i].location[0].latitude);
    var lat=restaurantList[i].location[0].latitude;
    console.log('rlo',restaurantList[i].location[0].longitude);
    var long=restaurantList[i].location[0].longitude;
    new google.maps.Marker({
      position: new google.maps.LatLng(lat,long),
      map: map,
      title: 'Hello Sushi!'
    });
  }
}

$(document).ready(function() {

  console.log('app.js loaded!');
  // $.ajax({
  //   method:'GET',
  //   url:'/api/restaurants',
  //   success: getRestaurantSuccess,
  //   error: getRestaurantError
  // });

  $('#restaurant-form').on('submit', function(e) {
    e.preventDefault();
    var restaurantname=$("#restaurantname").val();
    var comments=$('#comments').val();
    var rating=$('#rating').val();
    var lat=parseInt($('#lat').val());
    var long=parseInt($('#long').val());
    console.log(restaurantname,rating,lat,long,comments);
    $.ajax({
      method: 'POST',
      url: '/api/restaurants',
      data: {name: restaurantname,
            location: {latitude:parseInt(lat),longitude:parseInt(long)},
            rating: rating,
            comments: {date:Date(),body:comments}},
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
      $('#editCommentModal').on('click', '.save-changes', function editComment(e){
          e.preventDefault();
          // restaurantId = $(this).closest('.restaurant').data('restaurant-id');
          var commentId = $(this).closest('.comment-form').data('comment-id');
          console.log(commentId);
          var commentDate = Date();
          console.log($(this).context.form[1].value);
          commentDate=$(this).context.form[0].value;
          console.log($(this).context.form[0].value);
          var commentBody= $(this).context.form[1].value;
          console.log(commentDate,commentBody);
          $.ajax({
            method: 'PUT',
            url: '/api/restaurants/'+restaurantId+'/comments/'+commentId,
            data: {date: commentDate, body:commentBody},
            success: editCommentSuccess,
            error: editCommentError
          });
          $('#editCommentModal').modal('hide');
      });// POST to SERVER
  });
  $('#restaurants').on('click', '.add-comment', function addComment(e){
      e.preventDefault();
      $('#addCommentModal').modal('show');
      restaurantId = $(this).closest('.restaurant').data('restaurant-id');

      $('#addCommentModal').on('click', '.save-changes', function addComment(e){
          e.preventDefault();
          // restaurantId = $(this).closest('.restaurant').data('restaurant-id');
          var commentDate = Date();
          console.log($(this).prev());
          var commentBody= $(this).closest('.comment-body').val();
          var $modal = $('#addCommentModal');
          var $commentDate = $modal.find('#commentDate');
          var $commentBody = $modal.find('#commentBody');
          console.log($commentDate,$commentBody);
          var dataToPost = {
            date: $commentDate.val(),
            body: $commentBody.val()
          };
          console.log(dataToPost);
          $.ajax({
            method: 'POST',
            url: '/api/restaurants/'+restaurantId+'/comments',
            data: dataToPost,
            success: getCommentSuccess,
            error: getCommentError
          });
          $('#addCommentModal').modal('hide');
      });// POST to SERVER
  });

  $('#editCommentModal').on('click', '.delete-comment', function deleteComment(e){
      e.preventDefault();
      // restaurantId = $(this).closest('.restaurant').data('restaurant-id');
      var commentId = $(this).closest('.comment-form').data('comment-id');
      console.log(restaurantId);
      console.log(commentId);
      $.ajax({
        method: 'DELETE',
        url: '/api/restaurants/'+restaurantId+'/comments/'+commentId,
        success: deleteCommentSuccess,
        error: deleteCommentError
      });
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
    var Rid=$(this).context.offsetParent.parentElement.dataset.restaurantId;
    console.log(Rid);
    e.preventDefault();
    console.log($(this).parent().context);
    console.log($('#'+Rid).parents().eq(0));
    console.log($('#'+Rid).closest('.edit-restaurant'));
    $($('#'+Rid).closest('.edit-restaurant').context.activeElement).html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
    $($('#'+Rid).parent()[0].parentElement.children[0]).html('Restaurant Name:<input type=text id="restaurant-name-edited"></form>');
    $($('#'+Rid).parent()[0].parentElement.children[1]).html('Longitude:<input type=text id="longitude" placeholder="longitude">Latitude:<input type=text id="latitude" placeholder="latitude">');
    $($('#'+Rid).parent()[0].parentElement.children[2]).html('Rating:<input type=text id="rating-edited">');
  });

  $('#restaurants').on('click', '#saveChanges', function saveChanges(e){
    e.preventDefault();
    var restaurantId = $(this).closest('.restaurant').data('restaurant-id');
    var editedRestaurantName = $('#restaurant-name-edited').val();
    var lat = parseInt($('#latitude').val());
    var long = parseInt($('#longitude').val());
    var editedRating = parseInt($('#rating-edited').val());
    // var editedRestaurantName = $('#restaurant-name-edited').val().toString();
    // var lat = parseInt($('#latitude').val());
    // var long = parseInt($('#longitude').val());
    // var editedRating = parseInt($('#rating-edited').val());
    console.log(restaurantId,editedRestaurantName,lat,long,editedRating);
    $.ajax({
      method: 'PUT',
      url: 'api/restaurants/'+restaurantId,
      data: {name: editedRestaurantName, location: {latitude:lat,longitude:long}, rating: editedRating},
      success: onEditSuccess,
      error: onEditError
    });
  });
});

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
function deleteCommentSuccess(json){
  console.log(json);
  console.log('deleted Comment with id:', commentId);
}
function deleteCommentError(json){
  console.log(json);
}
function editCommentSuccess(json){
  console.log(json);
}
function editCommentError(json){
  console.log(json);
}
function addCommentSuccess(json){
  console.log(json);
  console.log('added comment!');
  renderRestaurant(json);
}
function addCommentError(err){
  console.log(err);
  console.log('add comment error!');
}
function getRestaurantSuccess(restaurant){
  restaurantList=restaurant;
  restaurantList.forEach(function(restaurant) {
    renderRestaurant(restaurant);
  });
}
function getRestaurantError(json){
  console.log(json);
}
