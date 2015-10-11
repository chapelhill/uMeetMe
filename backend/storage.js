/**
 * Storage part of the umeetup backend.
 * 
 * Until we have a working DB, this stores things.
 */
var $ = require('jquery-latest');
var fs = require('fs');

var USERS = {};

/**
 * Saves the user DB to JSON.
 */
function dump_data() {
    fs.writeFile('./users.json', JSON.stringify(USERS));
}

/**
 * Reads the saved users data from JSON.
 */
function read_data() {
    fs.readFile('./users.json', function(err, data) {
        if (err) throw err;
        
        USERS = JSON.parse(data);
        console.log("Processed " + Object.keys(USERS).length + " users");
    });
}

read_data();
setInterval(dump_data, 5 * 60 * 1000);
 
exports.StorageError = function(message) {
    this.message = "Error in storage: " + message;
}
 
 /**
  * Returns a list of usernames.
  */
exports.get_usernames = function() {
    var users = [];
    $.each(USERS, function(property, value) {
        users.push(property);
    })
    
    return users;
}

/**
 * Returns the data for a single user.
 * 
 * Throws an exception if the user does not exist.
 */
exports.read_user = function(username) {
    if (!(username in USERS)) {
        throw new exports.StorageError("Cannot read: " + username + " does not exist");
    }
    
    return USERS[username];
}

/**
 * Creates a new user.
 * 
 * Throws an exception if the user exists.
 */
exports.create_user = function(username, data) {
    if (username in USERS) {
        throw new exports.StorageError("Cannot create: " + username + " already exists");
    }
    
    USERS[username] = data;
    dump_data();
}

/**
 * Updates the data for a single user.
 * 
 * Thorws an exception if the user doesn't exist.
 */
exports.update_user = function(username, data) {
    if (!(username in USERS)) {
        throw new exports.StorageError("Cannot update: " + username + " does not exist");
    }
    
    USERS[username] = data;
    dump_data();
}

/**
 * Deletes a user.
 * 
 * Thorws an exception if the user doesn't exist.
 */
exports.delete_user = function(username) {
    if (!(username in USERS)) {
        throw new exports.StorageError("Cannot delete: " + username + " does not exist");
    }
    
    delete USERS[username];
    dump_data();
}

function comptabile(a_gender, b_interest) {
    if (b_interest == 'both') return true;
    return a_gender === b_interest;
}

/**
 * Finds who might be interested in a user.
 */
exports.find_mates = function(username) {
    if (!(username in USERS)) {
        throw new exports.StorageError('Cannot search for: ' + username + ' does not exist');
    }
    
    var potential_mates = [];
    var user_gender = USERS[username].gender;
    var user_interest = USERS[username].interest;
    for (var search_user in USERS) {
        if (search_user === username) {
            continue;
        }
        
        var search_gender = USERS[search_user].gender;
        var search_interest = USERS[search_user].interest;
        if (comptabile(user_gender, search_interest) && comptabile(search_gender, user_interest)) {
            potential_mates.push(search_user);
        }
    }
    
    return potential_mates;
}