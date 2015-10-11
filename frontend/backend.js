var BACKEND_URL = 'https://umeetupback-jasonqiao.c9.io';

function xmlHTTP(url, method, data, on_success, on_fail) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status >= 200 && xhttp.status < 300) {
          on_success(xhttp.responseText, xhttp);
        } else {
          on_fail(xhttp);
        }
      }
  }
  
  data = JSON.stringify(data);
  xhttp.open(method, url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(data);
  
  console.log(method + ' ' + url);
  console.log('Sending: ' + data);
};

var ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
function oneYearFromNow() {
    var now = new Date().getTime();
    
    var nextYear = new Date();
    nextYear.setDate(now + ONE_YEAR);
    return nextYear.toGMTString();
}

function create_cookie(name, value) {
    var cookie = (
        name + "=" + value +
            "; expires=" + oneYearFromNow() +
            "; path=/"
    );
    
    document.cookie = cookie;
}

function read_cookie(name) {
    var cookieParts = document.cookie.split(';');
    for (var i = 0; i < cookieParts.length; i++) {
        var cp = cookieParts[i];
        while (cp[0] === ' ') cp = cp.slice(1);
        if (cp.indexOf(name + '=') == 0) return cp.slice(name.length + 1);
    }
}