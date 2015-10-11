/**
 * Stores which users have confirmed dated each other.
 */
var $ = require('jquery-latest');
var fs = require('fs');

var DATE_GRAPH = {};

/**
 * Saves the date graph to JSON.
 */
function dump_data() {
    fs.writeFile('./dates.json', JSON.stringify(DATE_GRAPH));
}

/**
 * Reads the date graph from JSON.
 */
function read_data() {
    fs.readFile('./dates.json', function(err, data) {
        if (err) throw err;
        
        DATE_GRAPH = JSON.parse(data);
        console.log("Processed " + Object.keys(DATE_GRAPH).length + " dates");
    });
}

read_data();
 
exports.DateError = function(message) {
    this.message = "Error in dating: " + message;
}

/**
 * Ensures that the user exists in the date graph.
 */
function create_in_graph(user) {
    if (!(user in DATE_GRAPH)) {
        DATE_GRAPH[user] = [];
    }
}

/**
 * Gets the date status between two users:
 * 
 * - 'none' means that no confirmations have taken place
 * - 'pending-me' means that user B has confirmed while A
 *    has not
 * - 'pending-other' means user A has confirmed while B
 *    has not
 * - 'confirmed' means that both sides have confirmed
 */
exports.get_date_status = function(a, b) {
    create_in_graph(a);
    create_in_graph(b);
    
    var a_confirmed_b = DATE_GRAPH[a].indexOf(b) != -1;
    var b_confirmed_a = DATE_GRAPH[b].indexOf(a) != -1;
    
    if (a_confirmed_b && b_confirmed_a) {
        return 'confirmed';
    } else if (!a_confirmed_b && !b_confirmed_a) {
        return 'none';
    } else if (!a_confirmed_b && b_confirmed_a) {
        return 'pending-me';
    } else if (!b_confirmed_a && a_confirmed_b) {
        return 'pending-other';
    }
}

/**
 * Confirms for one user that they have dated another.
 */
exports.confirm_date = function(dater, datee) {
    create_in_graph(dater);
    
    if (DATE_GRAPH[dater].indexOf(datee) != -1) {
        return;
    }
    
    DATE_GRAPH[dater].push(datee);
    dump_data();
}