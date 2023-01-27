const {google} = require('googleapis');


// decide if download data from mongo or google api
exports.get = async function(apiGetter, cache, season) {
  const cacheResult = await cache.get(season)
  if (cacheResult) {
      return cacheResult
    }
    else {
      return apiGetter(season).then(cache.set)
    }
}

exports.getSheets = function(season) {
  const promise = new Promise((resolve, reject) => {
    const sheets = google.sheets({version: 'v4', auth: process.env.API_KEY});
    sheets.spreadsheets.values.get({
      spreadsheetId: '0Ar1Jmgo4O1wrdDVVYjZWRDkxQ1EwY3oyUG16dEZCSVE',
      range: season,
    }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        let data = {};
        data.dataToSave = exports.toCoordinateObj(res.data.values)
        data.season = season
        resolve(data)
      }
    })
  })
  return promise
}

exports.toCoordinateObj = function(rows) {
  const FIRST_LETTER = 65 //A
  let rowNo = 0
  const data = {}
  rows.forEach(row => {
    rowNo++
    for(let i=0; i < row.length; i++) {
      var coordinates = String.fromCharCode(FIRST_LETTER + i) + rowNo
      data[coordinates] = row[i]
    }
  })
  return data
}
