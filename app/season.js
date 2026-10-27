function getCurrent() {
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth() + 1

  return month > 8 ? year : year - 1
}

exports.getFirstSeason = function () {
  return 2013
}

exports.get = getCurrent

function parseSeason(value) {
  if (typeof value !== 'string' || !/^\d{4}$/.test(value)) return undefined
  const selected = Number(value)
  return selected >= exports.getFirstSeason() && selected <= getCurrent()
    ? selected
    : undefined
}

// sets season, based on query param or cookie value
exports.set = function (req, res) {
  const selected = parseSeason(req.query?.season)
  if (selected !== undefined) {
    res.cookie('season', selected, {
      maxAge: 1000 * 3600 * 24 * 30 * 12,
      httpOnly: true,
      sameSite: 'lax',
    })
    return selected
  }
  return parseSeason(req.cookies?.season) ?? getCurrent()
}

exports.getSeasons = function () {
  var arr = []

  for (var i = exports.getFirstSeason(); i <= getCurrent(); i++) {
    arr.push(i)
  }

  return arr
}

exports.getSeasonsUpTo = function (current) {
  let arr = []

  for (let i = exports.getFirstSeason(); i <= current; i++) {
    arr.push(i)
  }

  return arr
}
