var data     = require('../app/data.js');
var Q        = require('q');

/*
 * GET home page.
 */

exports.index = function(req, res){

  data.get().done(function(data){
    res.render('index', { title: 'Express', data: JSON.stringify(data) });
  });

};