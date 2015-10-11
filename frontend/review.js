function submitReview() {
    var review_text = document.getElementById('review-text').value;
    var review_target = window.location.search.substring(1);
    var token = read_cookie('token');
    
    xmlHTTP('/review/' + review_target + '?session=' + token, 'POST', {'body': review_text},
        function(response, xhttp) {
            window.location = '/matches.html';
        },
        function(xhttp) {
            alert('Review not posted!');
        });
}