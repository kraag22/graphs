var data = require('../app/data.js')
var season = require('../app/season.js')
const serialize = require('../app/serialize.js')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 12 * 60 * 60, checkperiod: 4 * 60 * 60 })

function getSettings(data, selectedSeason) {
  return {
    data: serialize(data),
    season: selectedSeason,
    seasons: season.getSeasons(),
  }
}

async function render(
  req,
  res,
  view,
  addAdditionalSettings = async function (settings) {
    return settings
  }
) {
  const selectedSeason = season.set(req, res)
  const seasonData = await data.get(data.getSheets, cache, selectedSeason)
  const transformedData = await addAdditionalSettings(
    getSettings(seasonData, selectedSeason),
    seasonData,
    data.getSheets,
    cache
  )

  res.render(view, transformedData)
}

exports.completion = async function (req, res) {
  await render(req, res, 'completion')
}

exports.mates = async function (req, res) {
  await render(req, res, 'mates')
}

exports.chance = async function (req, res) {
  await render(req, res, 'chance', data.addChanceData)
}

exports.totals = async function (req, res) {
  await render(req, res, 'totals')
}
