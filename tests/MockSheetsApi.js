const seasonData = require('./seasonData.json')

class MockSheetsApi {
  constructor(season) {
    this.season = season
  }

  getSheets(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
      resolve(seasonData)
    })
  }
}

exports.MockSheetsApi = MockSheetsApi
