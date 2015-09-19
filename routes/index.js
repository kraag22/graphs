var data     = require('../app/data.js');
var season   = require('../app/season.js');

exports.index = function(req, res){

	season.set(req);

  data.get(season.get()).done(function(data){
    res.render('index', { data: JSON.stringify(data), season:season.get()});
  });

};