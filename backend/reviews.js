/**
 * Stores reviews for each user.
 */
var $ = require('jquery-latest');
var fs = require('fs');

var REVIEWS = {};

/**
 * Saves the date graph to JSON.
 */
function dump_data() {
    fs.writeFile('./reviews.json', JSON.stringify(REVIEWS));
}

/**
 * Reads the date graph from JSON.
 */
function read_data() {
    fs.readFile('./reviews.json', function(err, data) {
        if (err) throw err;
        
        REVIEWS = JSON.parse(data);
        console.log("Processed " + Object.keys(REVIEWS).length + " reviews");
    });
}

read_data();
setInterval(dump_data, 5 * 60 * 1000);
 
exports.ReviewError = function(message) {
    this.message = "Error in reviews: " + message;
}

/**
 * Ensure that the given user at least has an empty set of reviews.
 */
function create_in_reviews(user) {
    if (!(user in REVIEWS)) {
        REVIEWS[user] = {};
    }
}

/**
 * Gets all reviews for the given person.
 */
exports.get_reviews = function(username) {
    create_in_reviews(username);
    return REVIEWS[username];
}

/**
 * Creates a new review for the given person.
 * 
 * Throws an exception if there is an error.
 */
exports.submit_review = function(reviewer, username, review_text) {
    create_in_reviews(username);
    
    if (reviewer in REVIEWS[username]) {
        throw new exports.ReviewError(reviewer + ' has already reviewed ' + username);
    }
    
    console.log('::: ' + JSON.stringify(review_text));
    REVIEWS[username][reviewer] = review_text;
    console.log('Reviews of ' + username + ':: ' + JSON.stringify(REVIEWS[username]));
    
    dump_data();
}