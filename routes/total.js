var data     = require('../app/data.js');
var mongo    = require('../app/mongo.js');
var Q        = require('q');

exports.list = function(req, res){

  data.get().done(function(data){
    res.render('total', { data: JSON.stringify(data) });
    mongo.close();
  });

};