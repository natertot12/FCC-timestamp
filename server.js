var http = require('http'),
    fs = require('fs'),
    url = require("url"),
    moment = require("moment");

    //moment().format();

fs.readFile('./client/index.html', function (err, html) {
    if (err) throw err;
    http.createServer(function(request, response) {  
      function natToUnix(date) {
            // Conver from natural date to unix timestamp
            return moment(date, "MMMM D, YYYY").format("X");
        }
    
        function unixToNat(unix) {
            // Convert unix timestamp to natural date
            return moment.unix(unix).format("MMMM D, YYYY");
        }
        response.writeHeader(200, {"Content-Type": "text/html"});
        //response.write(html);  
        
        var fullUrl = url.parse(request.url, false, false);
        fullUrl = fullUrl.path.substr(1);
        
        /*
        var date = new Date();
        
        var time = date.toDateString(fullUrl);
        response.write("<p>" + time + "</p>");
        var ms = date.getTime(fullUrl);
        response.write("<p>" + ms + "</p>");
        
        if(moment(fullUrl).isValid()) {
          var date = moment(fullUrl);
          response.write(date);
          response.write(fullUrl);
        }
        */
        var date = fullUrl;
        var unix = null;
        var natural = null;
        
        // Check for initial unix time
        if (+date >= 0) {
            unix = +date;
            natural = unixToNat(unix);
        } 
        
        // Check for initial natural time
        if (isNaN(+date) && moment(date, "MMMM D, YYYY").isValid()) {
            unix = natToUnix(date);
            natural = unixToNat(unix);
        }
        
        var dateObj = { "unix": unix, "natural": natural };
        response.write(JSON.stringify(dateObj));
        
        response.end();
    }).listen(8080);
});