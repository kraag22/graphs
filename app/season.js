
function getCurrent() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;

  return ( month > 8 ? year : (year - 1));
}

//default season
var season = getCurrent();

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

exports.getSeasons = function() {
  var arr = [];

  for (var i = 2013; i <= getCurrent(); i++) {
    arr.push(i);
  }

  return arr;
};
