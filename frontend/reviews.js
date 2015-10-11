$(document).ready(function() {
    var token = read_cookie('token');
    var review_target = window.location.search.substring(1);
    
    var review_list = document.getElementById('reviews');
    
    xmlHTTP('/review/' + review_target + '?session=' + token, 'GET', null,
    function(json, xhttp) {
        var reviews = JSON.parse(json);
        if (Object.keys(reviews).length == 0) {
            var no_reviews = document.createElement('h1');
            no_reviews.appendChild(document.createTextNode('This person has no reviews - maybe you could write one?'));
            
            document.body.appendChild(no_reviews);
        } else {
            $.each(reviews, function(reviewer, text) {
                var review_box = document.createElement('div');
                review_box.className = 'review-box';
                
                var reviewerdiv = document.createElement('div');
                reviewerdiv.className = 'review-box-reviewer';
                reviewerdiv.appendChild(document.createTextNode(reviewer + ' says:'));
                
                var reviewBody = document.createElement('div');
                reviewBody.className = 'review-box-body';
                reviewBody.appendChild(document.createTextNode(text));
                
                review_box.appendChild(reviewerdiv);
                review_box.appendChild(reviewBody);
                review_list.appendChild(review_box);
            });
        }
    },
    function(xhttp) {
        document.location = '/login.html';
    })
});