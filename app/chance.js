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
    return item.data[name]?.chance
  })

  playerData = playerData.filter((item) => {
    return item != null && item != undefined
  })

  const sum = playerData.reduce((acc, item) => {
    return acc + item
  }, 0)

  return Math.round(sum / playerData.length)
}

exports.getPlayersInSeason = function (seasonData) {
  let graphs = new Graphs(seasonData)
  return Object.values(graphs.getPlayers(1))
}

exports.getPlayersChancesInSeason = function (seasonData) {
  let graphs = new Graphs(seasonData)
  return graphs.getPlayerChances()
}
