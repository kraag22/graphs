
//default season
var season = 2015;

// return currently active season
exports.get = function () {
  return season;
};

// sets season, based on query param or cookie value
exports.set = function (req, res) {

	if (req.query.season && !isNaN(parseInt(req.query.season))) {
		season = parseInt(req.query.season);

		res.cookie('season', season, {maxAge: 1000*3600*24*30*12});
	}
	else if (req.cookies.season) {
		season = parseInt(req.cookies.season);
	}

};