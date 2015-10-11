var USERS = {};

var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var storage = require('./storage.js');
var dategraph = require('./date-graph.js');
var reviews = require('./reviews.js');
var sessions = require('./sessions.js');
sessions.init(storage);

var app = express();

app.use(express.static('../frontend'));

/**
 * Reads function from a request object, and then calls the function with the
 * JSON data loaded.
 */
function withJSON(request, func) {
    var buffer = '';
    request.on('data', function(chunk) {
        buffer += chunk;
    });

    request.on('end', function() {
      func(JSON.parse(buffer));
    });
}

app.get('/users', function(req, resp) {
  try {
    sessions.check_site_access(req.query.session);
    resp.send(storage.get_usernames());
  } catch (error) {
    console.log(error.message);
    resp.status(400);
    resp.send('Denied');
  }
});

app.get('/users/:id', function(req, resp) {
  try {
    sessions.check_site_access(req.query.session);
    var info = storage.read_user(req.params.id);
    resp.status(200);
    resp.send(JSON.stringify(info));
  } catch (error) {
    console.log(error.message);
    if (error instanceof storage.StorageError) {
      resp.status(400);
      resp.send('User ' + req.params.id + ' does not exist');
    } else if (error instanceof sessions.SessionError) {
      resp.status(403);
      resp.send('Denied');
    } else {
      throw error;
    }
  }
});

app.post('/users/:id', function(req, resp) {
  withJSON(req, function(body) {
    try {
      storage.create_user(req.params.id, body);
      resp.status(201);
      resp.send('OK');
    } catch (error) {
      console.log(error.message);
      resp.status(400);
      resp.send('User ' + req.params.id + ' already exists');
    }
  });
});

app.put('/users', function(req, resp) {
  withJSON(req, function(body) {
    try {
      var username = sessions.check_site_access(req.query.session);
      storage.update_user(username, body);
      resp.status(201);
      resp.send('OK');
    } catch (error) {
      if (error instanceof storage.StorageError) {
        resp.status(400);
        resp.send('User ' + req.params.id + ' does not exist');
      } else if (error instanceof sessions.SessionError) {
        resp.status(403);
        resp.send('Denied');
      } else {
        throw error;
      }
    }
  });
});

app.delete('/users', function(req, resp) {
  try {
    var username = sessions.check_site_access(req.query.session);
    storage.delete_user(username);
    
    resp.status(200);
    resp.send('OK');
  } catch (error) {
    console.log(error.message);
    if (error instanceof storage.StorageError) {
      resp.status(400);
      resp.send('User ' + req.params.id + ' does not exist');
    } else if (error instanceof sessions.SessionError) {
      resp.status(403);
      resp.send('Denied');
    } else {
      throw error;
    }
  }
});

app.get('/interested-in', function(req, resp) {
  try {
    var username = sessions.check_site_access(req.query.session);
    var interested_in = storage.find_mates(username);
    
    resp.status(200);
    resp.send(JSON.stringify(interested_in));
  } catch (error) {
    console.log(error.message);
    if (error instanceof storage.StorageError) {
      resp.status(400);
      resp.send('User ' + req.params.id + ' does not exist');
    } else if (error instanceof sessions.SessionError) {
      resp.status(403);
      resp.send('Denied');
    } else {
      throw error;
    }
  }
});

app.put('/session/:id', function(req, resp) {
  withJSON(req, function(body) {
    try {
      var token = sessions.authenticate(req.params.id, body.password);
      resp.status(200);
      resp.send(JSON.stringify({'token': token}));
    } catch (error) {
      console.log(error.message);
      resp.status(403);
      resp.send('Denied');
    }
  });
});

app.get('/dated/:id', function(req, resp) {
  try {
    var dater = sessions.check_site_access(req.query.session);
    var status = dategraph.get_date_status(dater, req.params.id);
    
    resp.status(200);
    resp.send(JSON.stringify(status));
  } catch (error) {
    console.log(error.message);
    resp.status(403);
    resp.send('Denied');
  }
})

app.post('/dated/:id', function(req, resp) {
  try {
    var dater = sessions.check_site_access(req.query.session);
    dategraph.confirm_date(dater, req.params.id);
    
    resp.status(200);
    resp.send('OK');
  } catch (error) {
    console.log(error.message);
    resp.status(403);
    resp.send('Denied');
  }
})

app.get('/review/:id', function(req, resp) {
  try {
    sessions.check_site_access(req.query.session);
    var revs = reviews.get_reviews(req.params.id);
    
    resp.status(200);
    resp.send(JSON.stringify(revs));
  } catch (error) {
    console.log(error.message);
    resp.status(403);
    resp.send('Denied');
  }
})

app.post('/review/:id', function(req, resp) {
  withJSON(req, function(body) {
    try {
      var reviewer = sessions.check_site_access(req.query.session);
      reviews.submit_review(reviewer, req.params.id, body.body);
      
      resp.status(200);
      resp.send('OK');
    } catch (error) {
      console.log(error.message);
      if (error instanceof sessions.SessionError) {
        resp.status(403);
        resp.send('Denied');
      } else if (error instanceof reviews.ReviewError) {
        resp.status(400);
        resp.send('Review already exists');
      }
    }
  });
})

app.listen(process.env.PORT);