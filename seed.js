// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");
var restaurantList=[];
var commentList=[];

restaurantList.push({
  name: Koo,
  location: {longitude: 255,
              latitude: 255},
  rating: 9,
});
restaurantList.push({
  name: Sushi_Ota,
  location: {longitude: 300,
              latitude: 89.5},
  rating: 8
});
restaurantList.push({
  name: Sushi_Den,
  location: {longitude: 200,
              latitude: 189},
  rating: 10,
});
restaurantList.push({
  name: Fuki_Sushi,
  location: {longitude: 29,
              latitude: 100},
  rating: 7,
});

commentList.push({ date: 10/1/206,
                    body: "I like this restaurant. The fish is fresh, chefs are nice, and servers are very friendly."
});
commentList.push({ date: 10/15/206,
                    body: "I like this restaurant. The fish is fresh, chefs are nice, and servers are very friendly."
});
commentList.push({ date: 3/1/206,
                    body: "I like this restaurant. The fish is fresh, chefs are nice, and servers are very friendly."
});
commentList.push({ date: 4/5/206,
                    body: "I like this restaurant. The fish is fresh, chefs are nice, and servers are very friendly."
});
var yelpdata ={ "businesses": [
        {
            "categories": [
                [
                    "Local Flavor",
                    "localflavor"
                ],
                [
                    "Mass Media",
                    "massmedia"
                ]
            ],
            "display_phone": "+1-415-908-3801",
            "id": "yelp-san-francisco",
            "image_url": "http://s3-media3.fl.yelpcdn.com/bphoto/nQK-6_vZMt5n88zsAS94ew/ms.jpg",
            "is_claimed": true,
            "is_closed": false,
            "location": {
                "address": [
                    "140 New Montgomery St"
                ],
                "city": "San Francisco",
                "coordinate": {
                    "latitude": 37.7867703362929,
                    "longitude": -122.399958372115
                },
                "country_code": "US",
                "cross_streets": "Natoma St & Minna St",
                "display_address": [
                    "140 New Montgomery St",
                    "Financial District",
                    "San Francisco, CA 94105"
                ],
                "geo_accuracy": 9.5,
                "neighborhoods": [
                    "Financial District",
                    "SoMa"
                ],
                "postal_code": "94105",
                "state_code": "CA"
            },
            "mobile_url": "http://m.yelp.com/biz/yelp-san-francisco",
            "name": "Yelp",
            "phone": "4159083801",
            "rating": 2.5,
            "rating_img_url": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/c7fb9aff59f9/ico/stars/v1/stars_2_half.png",
            "rating_img_url_large": "http://s3-media2.fl.yelpcdn.com/assets/2/www/img/d63e3add9901/ico/stars/v1/stars_large_2_half.png",
            "rating_img_url_small": "http://s3-media4.fl.yelpcdn.com/assets/2/www/img/8e8633e5f8f0/ico/stars/v1/stars_small_2_half.png",
            "review_count": 7140,
            "snippet_image_url": "http://s3-media4.fl.yelpcdn.com/photo/YcjPScwVxF05kj6zt10Fxw/ms.jpg",
            "snippet_text": "What would I do without Yelp?\n\nI wouldn't be HALF the foodie I've become it weren't for this business.    \n\nYelp makes it virtually effortless to discover new...",
            "url": "http://www.yelp.com/biz/yelp-san-francisco"
        }
    ],
    "total": 2316
};


restaurantList.forEach(function(restaurant) {
  restaurant.comments = comments;
});

db.Restaurant.remove({}, function(err, restaurants){

  db.Restaurant.create(restaurantList, function(err, restaurants){
    if (err) { return console.log('ERROR', err); }
    console.log("created", restaurants.length, "restaurants");
    process.exit();
  });

});
