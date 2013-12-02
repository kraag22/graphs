var Q   = require('q');
var parseString = require('xml2js').parseString;

exports.parseXML = function (xml) {

  var deffered = Q.defer();

  parseString(xml, function(err, result) {

    if (err) {
      deffered.reject(err);
    }

    deffered.resolve(result);
    
  });

  return deffered.promise;
};

exports.prepare = function(obj) {

    console.log('parsing');
    var prepared = {};
    
    var entries = obj.feed.entry;
    entries.forEach(function(row) {
        prepared[row.title[0]._] = row.content[0]._;
    });

    return prepared;
};