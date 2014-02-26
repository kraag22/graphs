var data     = require('../app/data.js');
var mongo    = require('../app/mongo.js');
var Q        = require('q');

/*
 * GET home page.
 */

exports.index = function(req, res){

  data.get().done(function(data){
    res.render('index', { data: JSON.stringify(data) });
  });

};