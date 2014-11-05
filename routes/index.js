var data     = require('../app/data.js');
var season   = require('../app/season.js');

/*
 * GET home page.
 */

exports.index = function(req, res){

  data.get(season.get()).done(function(data){
    res.render('index', { data: JSON.stringify(data) });
  });

};