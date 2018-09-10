var https   = require('http');

exports.cellsXML = function (key, season) {
  const promise = new Promise((resolve, reject) => {
    var page = '1';

    if (season > 2013) {
      // 2014 = 2, 2018 = 6
      page = season - 2012;
    }

    console.log('/feeds/cells/'+key+'/'+page+'/public/basic');
    var options = {
      host: 'spreadsheets.google.com',
      port: 80,
      path: '/feeds/cells/'+key+'/'+page+'/public/basic',
      method: 'GET'
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function() {
        resolve(body);
      });

      res.on('error', function(e) {
        reject(new Error(e.message));
      });

    });

    req.end();

    req.on('error', function(e) {
      reject(e);
    });
  })
  return promise;
};

