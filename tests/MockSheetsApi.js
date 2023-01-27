const seasonData = require('./seasonData.json')

// const mockSheetsApi = {
//   sheets: {
//     spreadsheets: {
//       values: {
//         get: getSheets
//       }
//     }
//   }
// }

class MockSheetsApi {
  constructor(season) {
    this.season = season
  }

  getSheets(spreadsheetId, range) {
    return new Promise((resolve, reject) => {
      resolve({
        season: this.season,
        dataToSave: seasonData
      })
    })
  }
}

exports.MockSheetsApi = MockSheetsApi
