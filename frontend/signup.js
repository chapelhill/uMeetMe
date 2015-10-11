function onSignup() {
  var email = document.getElementById('email').value;
  var username = document.getElementById('username').value;
  if (!username.match(/[A-Za-z0-9]+/)) {
    alert('Only letters and numbers are allowed in usernames');
  }
  
  var password = document.getElementById('password').value;
  var gender = ['male', 'female'][document.getElementById('sex').selectedIndex];
  var interest = ['male', 'female', 'both'][document.getElementById('interest').selectedIndex];
  var age = Number(document.getElementById('age').value);
  
  if (age < 18) {
    alert('This site is not suitable fokr minors');
    return;
  }
  
  if (password.length < 7) {
    alert('Password must contain at least 7 characters');
    return;
  }
  
  var data = {'email': email, 'username': username, 'password': password, 'gender': gender, 'interest': interest, 'age': age};
  xmlHTTP('/users/' + username, 'POST', data,
    function(response, xhttp) {
      xmlHTTP('/session/' + username, 'PUT', {'password': password},
        function success(response, xmlhttp) {
             var token = JSON.parse(response).token;
             create_cookie('token', token);
             
             document.location = '/matches.html';
        },
        function error(xmlhttp) {
        }
      );
    },
    function(xhttp) {
      alert('Username already taken');
    });
}