const { Graphs } = require('../public/javascripts/Graphs.js')

exports.getPlayerChances = function (seasonsData) {
  return seasonsData.map((item) => {
    let graphs = new Graphs(item.data)
    return {
      season: item.season,
      data: graphs.getPlayerChances().reduce((acc, item) => {
        acc[item.player] = item
        return acc
      }, {}),
    }
  })
}

exports.computeChance = function (playerChancesData, name) {
  let playerData = playerChancesData.map((item) => {
    return item.data[name].chance
  })

  const sum = playerData.reduce((acc, item) => {
    return acc + item
  }, 0)

  return Math.round(sum / playerData.length)
}
