const { google } = require('googleapis')
const chance = require('./chance.js')
const season = require('./season.js')

// use cache or google api
exports.get = async function (apiGetter, cache, season) {
  const cacheResult = await cache.get(season)

  if (cacheResult) {
    return cacheResult
  }

  const apiData = await apiGetter(season)
  await cache.set(season, apiData)
  return apiData
}

exports.getSheets = function (season) {
  const promise = new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: 'v4', auth: process.env.API_KEY })
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: '0Ar1Jmgo4O1wrdDVVYjZWRDkxQ1EwY3oyUG16dEZCSVE',
        range: season,
      },
      (err, res) => {
        if (err) {
          reject(err)
        } else {
          const data = exports.toCoordinateObj(res.data.values)
          resolve(data)
        }
      }
    )
  })
  return promise
}

exports.toCoordinateObj = function (rows) {
  const FIRST_LETTER = 65 //A
  let rowNo = 0
  const data = {}
  rows.forEach((row) => {
    rowNo++
    for (let i = 0; i < row.length; i++) {
      var coordinates = String.fromCharCode(FIRST_LETTER + i) + rowNo
      data[coordinates] = row[i]
    }
  })
  return data
}

// download data for all seasons
exports.getDataForSeasonsUpTo = async function (api, cache, seasons) {
  let promises = seasons.map((season) => {
    return exports.get(api, cache, season)
  })

  let allData = await Promise.all(promises)

  // return allData combined with seasons
  return allData.map((data, index) => {
    return {
      season: seasons[index],
      data: data,
    }
  })
}

exports.getChancesForPlayer = async function (api, cache, playerName) {
  const seasons = season.getSeasonsUpTo(season.get())
  const seasonsButLast = seasons.length > 1 ? seasons.slice(0, -1) : seasons

  const seasonsData = await exports.getDataForSeasonsUpTo(
    api,
    cache,
    seasonsButLast
  )
  let playersChances = chance.getPlayerChances(seasonsData)
  return chance.computeChance(playersChances, playerName)
}
