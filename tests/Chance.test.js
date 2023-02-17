const chance = require('../app/chance.js')
const data = require('../app/data.js')
const { FakeSheetsApi } = require('./FakeSheetsApi.js')
const { fakeCache } = require('./fakeCache.js')

describe('getPlayerChances()', () => {
  it('should work for multiple seasons', async () => {
    const result = await data.getDataForSeasonsUpTo(
      new FakeSheetsApi(),
      fakeCache('passing'),
      [2013, 2014]
    )

    let playersChances = chance.getPlayerChances(result)
    expect(playersChances).toHaveLength(2)

    const season2013 = playersChances[0]
    expect(Object.keys(season2013.data)).toHaveLength(9)
    const player = season2013.data['Víťa']
    expect(player.player).toBe('Víťa')
    expect(player.chance).toBe(81)

    const season2014 = playersChances[1]
    expect(Object.keys(season2014.data)).toHaveLength(9)
    const player2 = season2014.data['Vojta m']
    expect(player2.player).toBe('Vojta m')
    expect(player2.chance).toBe(63)
  })
})

describe('computeChance()', () => {
  it('should work for player', async () => {
    const result = await data.getDataForSeasonsUpTo(
      new FakeSheetsApi(),
      fakeCache('passing'),
      [2013, 2014]
    )

    let playersChances = chance.getPlayerChances(result)

    expect(chance.computeChance(playersChances, 'Víťa')).toBe(81)
  })
})
