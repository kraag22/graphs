var data     = require('../app/data.js');
var season   = require('../app/season.js');

exports.list = function(req, res){

  season.set(req, res);

  data.get(season.get()).done(function(data){
    res.render('total', {
      data: JSON.stringify(data),
      season:season.get(),
      seasons:season.getSeasons()});
  });

};
