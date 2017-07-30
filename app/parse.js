var parseString = require('xml2js').parseString;

exports.parseXML = function (xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, function(err, result) {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

exports.prepare = function(obj) {

  console.log('parsing');
  var prepared = {};

  var entries = obj.feed.entry;
  entries.forEach(function(row) {
    prepared[row.title[0]._] = row.content[0]._;
  });

  return prepared;
};
