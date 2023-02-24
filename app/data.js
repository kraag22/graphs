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

const getButLastSeasonsData = async function (api, cache) {
  const seasons = season.getSeasonsUpTo(season.get())
  const seasonsButLast = seasons.length > 1 ? seasons.slice(0, -1) : seasons
  return await exports.getDataForSeasonsUpTo(api, cache, seasonsButLast)
}

exports.addChanceData = async function (settingsData, seasonData, api, cache) {
  const players = chance.getPlayersInSeason(seasonData)
  const chances = chance.getPlayersChancesInSeason(seasonData)
  const seasonsData = await getButLastSeasonsData(api, cache)
  let playersChances = chance.getPlayerChances(seasonsData)

  const chancesInPreviousSeasons = players
    .map((playerName) => {
      return {
        name: playerName,
        chance: chance.computeChance(playersChances, playerName),
      }
    })
    .reduce((acc, item) => {
      acc[item.name] = item.chance
      return acc
    }, {})

  return {
    ...settingsData,
    chances: JSON.stringify(chances),
    chancesInPreviousSeasons: JSON.stringify(chancesInPreviousSeasons),
  }
}
