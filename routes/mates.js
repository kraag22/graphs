var data     = require('../app/data.js');
var season   = require('../app/season.js');
const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 12*60*60, checkperiod: 4*60*60 } );

exports.list = function(req, res){

  season.set(req, res);

  data.get(data.getSheets, cache, season.get()).then(function(data){
    res.render('mates', {
      data: JSON.stringify(data),
      season:season.get(),
      seasons:season.getSeasons()});
  });

};
