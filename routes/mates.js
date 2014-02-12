var data     = require('../app/data.js');
var Q        = require('q');

exports.list = function(req, res){

  data.get().done(function(data){
    res.render('mates', { data: JSON.stringify(data) });
  });

};