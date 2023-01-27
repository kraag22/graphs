var data     = require('../app/data.js');
var season   = require('../app/season.js');
var mongo    = require('../app/mongo.js');

exports.list = function(req, res){

  season.set(req, res);

  data.get(data.getSheets, mongo.mongoCache, season.get()).then(function(data){
    res.render('mates', {
      data: JSON.stringify(data),
      season:season.get(),
      seasons:season.getSeasons()});
  });

};
