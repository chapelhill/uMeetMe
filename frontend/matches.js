function confirm_the_date(token, other) {
    xmlHTTP('/dated/' + other + '?session=' + token, 'POST', null,
        function(json, xhttp) {
            location.reload();
        },
        function(xhttp) {
            alert('Problem! Could not confirm date.')
        });
}

function add_user(userdata) {
    var token = read_cookie('token');
    
    var toplevel = document.createElement('div');
    toplevel.className = 'user';
    
    var username = document.createElement('div');
    username.className = 'user-username';
    username.appendChild(document.createTextNode(userdata.username));
    
    var age = document.createElement('div');
    age.className = 'user-age';
    age.appendChild(document.createTextNode(userdata.age));
    
    var gender = document.createElement('div');
    gender.className = 'user-gender';
    gender.appendChild(document.createTextNode(userdata.gender.toUpperCase()));
    
    var interest = document.createElement('div');
    interest.className = 'user-interest';
    if (userdata.interest == 'male') {
        interest.appendChild(document.createTextNode('Men only'));
    } else if (userdata.interest == 'female') {
        interest.appendChild(document.createTextNode('Women only'));
    } else if (userdata.interest == 'both') {
        interest.appendChild(document.createTextNode('Bisexual'));
    }
    
    var email_me = document.createElement('a');
    email_me.className = 'user-email';
    email_me.href = 'mailto:' + userdata.email;
    email_me.appendChild(document.createTextNode('Email me!'));
    
    var view_reviews = document.createElement('a');
    view_reviews.className = 'user-data-reviews';
    view_reviews.href = 'reviews.html?' + userdata.username;
    view_reviews.appendChild(document.createTextNode('View my reviews'));
    
    xmlHTTP('/dated/' + userdata.username + '?session=' + token, 'GET', null,
        function(json, xhttp) {
            var date_status = JSON.parse(json);
            if (date_status === 'none' || date_status === 'pending-me') {
                var confirm_date = document.createElement('a');
                confirm_date.className = 'user-has-dated';
                confirm_date.onclick = function() {
                    confirm_the_date(token, userdata.username);
                }
                
                confirm_date.appendChild(document.createTextNode("Click if we have dated!"));
                toplevel.appendChild(confirm_date);
            } else if (date_status === 'confirmed') {
                var review_me = document.createElement('a');
                review_me.className = 'user-review';
                review_me.href = '/review.html?' + userdata.username;
                review_me.appendChild(document.createTextNode('Review me!'));
                
                toplevel.appendChild(review_me);
            } else {
                var pending = document.createElement('div');
                pending.className = 'user-date-pending'
                pending.appendChild(document.createTextNode('Waiting on a response before you can review.'));
                
                toplevel.appendChild(pending);
            }
        },
        function(xhttp) {}
    );
    
    toplevel.appendChild(username);
    toplevel.appendChild(age);
    toplevel.appendChild(gender);
    toplevel.appendChild(interest);
    toplevel.appendChild(email_me);
    toplevel.appendChild(view_reviews);
    
    document.getElementById('matches').appendChild(toplevel);
}

$(document).ready(function() {
    var token = read_cookie('token');
    xmlHTTP('/interested-in?session=' + token, 'GET', null,
    function(json, xhttp) {
        var users = JSON.parse(json);
        
        $.each(users, function(idx, username) {
            xmlHTTP('/users/' + username + '?session=' + token, 'GET', null,
            function(json, xhttp) {
                add_user(JSON.parse(json));
            },
            function(xhttp) {
            });
        });
    },
    function(xhttp) {
        document.location = '/login.html';
    })
});