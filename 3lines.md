$($('#'+Rid).closest('.edit-restaurant').context.activeElement).html('<button class="btn btn-danger edit" id="saveChanges">Save Changes</button>');
$($('#'+Rid).parent()[0].parentElement.children[0]).html('Restaurant Name:<input type=text id="restaurant-name-edited"></form>');
var Rid=$(this).context.offsetParent.parentElement.dataset.restaurantId;
var commentDate=$(this).context.form[0].value;
var commentBody=$(this).context.form[1].value;
