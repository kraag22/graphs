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