/**
 * Session handling.
 */
var $ = require('jquery-latest');
 
var SESSION_DIE_TIME = 1000 * 60 * 30; // 30 minutes
 
// For debugging purposes. We want to manipulate everything.
var SPECIAL_BACKDOOR_SESSION = '_';

var SESSIONS = {};
var ACTIVE_SESSIONS = {};

exports.SessionError = function(message) {
    this.message = "Error in storage: " + message;
    return this;
}

/**
 * Creates a new random integer, [0, end)
 */
function randint(end) {
    return Math.floor(Math.random() * end);
}

/**
 * Creates a new authentication token.
 */
var TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
var TOKEN_SIZE = 12;
function make_token() {
    var token = '';
    for (var idx = 0; idx < TOKEN_SIZE; idx++) {
        token = token + TOKEN_CHARS[randint(TOKEN_CHARS.length)];
    }
    
    return token;
}

/**
 * Routniely prunes unused sessions, which haven't had any activity recently.
 */
function clean_unused_sessions() {
    var dead = [];
    
    $.each(SESSIONS, function(token) {
        if (!(token in ACTIVE_SESSIONS)) {
            dead.push(token);
        }
    });
    
    ACTIVE_SESSIONS = {};
    
    $.each(dead, function(_, token) {
        delete SESSIONS[dead];
    });
    
    console.log('Cleaned ' + dead.length + ' sessions');
}

setInterval(clean_unused_sessions, SESSION_DIE_TIME);

var storage_instance = null;

/**
 * Initialize the module with the storage module.
 */
exports.init = function(storage) {
    storage_instance = storage;
}

/**
 * Gets a new session token, or fails with an exception.
 */
exports.authenticate = function(username, password) {
    var user_data = storage_instance.read_user(username);
    if (user_data.password === password) {
        var token = make_token();
        ACTIVE_SESSIONS[token] = true;
        SESSIONS[token] = username;
        
        console.log('New session for ' + username);
        return token;
    } else {
        console.log('Bad login for ' + username + '::' + password);
        throw new exports.SessionError('Failed to authenticate ' + username);
    }
}

/**
 * Returns the username associated with the session.
 * 
 * Throws an exception if the token is invalid.
 */
exports.check_site_access = function(token) {
    if (token.indexOf(SPECIAL_BACKDOOR_SESSION) === 0) {
        return token.slice(SPECIAL_BACKDOOR_SESSION.length);
    }
    
    if (token in SESSIONS) {
        return SESSIONS[token];
    }
    
    console.log('Failure to authenticate ' + token);
    throw new exports.SessionError('Not authenticated for site access');
}