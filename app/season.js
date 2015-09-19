
//default season
var season = 2015;

// return currently active season
exports.get = function () {
  return season;
};

// sets season, based on query param or cookie value
exports.set = function (req) {

	if (req.query.season && !isNaN(parseInt(req.query.season))) {
		season = parseInt(req.query.season);
	}
};