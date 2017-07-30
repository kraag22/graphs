var data     = require('../app/data.js');
var season   = require('../app/season.js');

exports.index = function(req, res){

	season.set(req, res);

  data.get(season.get()).then(function(data){
    res.render('index', {
      data: JSON.stringify(data),
      season:season.get(),
      seasons:season.getSeasons()});
  });

};
