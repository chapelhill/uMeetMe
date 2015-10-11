function login(){
     var username= document.getElementById('loginusername').value;
     var password = document.getElementById('loginpassword').value;
     
     xmlHTTP('/session/' + username, 'PUT', {'password': password},
          function success(response, xmlhttp) {
               var token = JSON.parse(response).token;
               create_cookie('token', token);
               
               document.location = '/matches.html';
          },
          function error(xmlhttp) {
               alert('Login failed');
               console.log(xmlhttp.responeText);
               console.log(xmlhttp.statusText);
          }
     );
}