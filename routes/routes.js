var data = require('../app/data.js')
var season = require('../app/season.js')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 12 * 60 * 60, checkperiod: 4 * 60 * 60 })

function getSettings(data) {
  return {
    data: JSON.stringify(data),
    season: season.get(),
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
  season.set(req, res)
  const seasonData = await data.get(data.getSheets, cache, season.get())
  const transformedData = await addAdditionalSettings(
    getSettings(seasonData),
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
