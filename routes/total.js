var data     = require('../app/data.js');
var season   = require('../app/season.js');
const Cache = require('file-system-cache').default
const cache = Cache()

exports.list = function(req, res){

  season.set(req, res);

  data.get(data.getSheets, cache, season.get()).then(function(data){
    res.render('total', {
      data: JSON.stringify(data),
      season:season.get(),
      seasons:season.getSeasons()});
  });

};
