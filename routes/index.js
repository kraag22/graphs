var appGet   = require('../app/get.js');
var appParse = require('../app/parse.js');
var Q        = require('q');

/*
 * GET home page.
 */

exports.index = function(req, res){

  appGet.cellsXML('0Ar1Jmgo4O1wrdDVVYjZWRDkxQ1EwY3oyUG16dEZCSVE')
  .then(appParse.parseXML)
  .done(function(data) {
    //res.send(data);
    res.render('index', { title: 'Express', data: JSON.stringify(data) });
  });

  
};