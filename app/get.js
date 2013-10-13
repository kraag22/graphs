var Q       = require('q');
var https   = require('http');

exports.cellsXML = function (key) {

  var deffered = Q.defer();

  console.log("/feeds/cells/"+key+"/od6/public/basic");

  var options = {
    host: "spreadsheets.google.com",
    port: 80,
    path: "/feeds/cells/"+key+"/od6/public/basic",
    method: 'GET'
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var body = '';
    
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function() {
      deffered.resolve(body);
    });

    res.on('error', function(e) {
      deffered.reject(new Error(e.message));
    });

  });

  req.end();

  req.on('error', function(e) {
    deffered.reject(e);
  });


  return deffered.promise;
};

