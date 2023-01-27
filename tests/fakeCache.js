const { get } = require('grunt')
const seasonData = require('./seasonData.json')

let cache = {}

exports.fakeCache = function(type = 'real') {
  let getter

  switch (type) {
    case 'passing':
      getter = function(season) {
        return new Promise((resolve, reject) => {
          resolve(seasonData)
        })
      }
      break;

    case 'failing':
      getter = function(season) {
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
      break;

    case 'real':
      getter = function(season) {
        return new Promise((resolve, reject) => {
          if (cache[season]) {
            resolve(cache[season])
          } else {
            resolve(false)
          }
        })
      }
      break;
    default:
      throw new Error('Invalid type: ' + type)
  }

  return {
    get: getter,
    set: function(key, data) {
      return new Promise((resolve, reject) => {
        if (!key) {
          reject('No key provided')
        }
        cache[key] = data
        resolve(data)
      })
    },
    clear: function() {
      cache = {}
    },
    sampleSeasonData: seasonData
  }
}
