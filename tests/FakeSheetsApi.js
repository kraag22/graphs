const seasonData = require('./seasonData.json')

class FakeSheetsApi {
  constructor(season) {
    this.season = season
  }

  getSheets(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
      resolve(seasonData)
    })
  }
}

exports.FakeSheetsApi = FakeSheetsApi
