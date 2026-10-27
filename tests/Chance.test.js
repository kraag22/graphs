const chance = require('../app/chance.js')
const data = require('../app/data.js')
const { FakeSheetsApi } = require('./FakeSheetsApi.js')
const { fakeCache } = require('./fakeCache.js')
const seasonData = require('./seasonData.json')

beforeEach(() => {
  jest.spyOn(data, 'allowedToUseCache').mockReturnValue(true)
})
afterEach(() => jest.restoreAllMocks())

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
  it('returns null when a player has no history, but preserves a zero chance', () => {
    expect(chance.computeChance([], 'New player')).toBeNull()
    expect(chance.computeChance([{ data: { Player: { chance: 0 } } }], 'Player')).toBe(0)
  })
  it('should work for player', async () => {
    const result = await data.getDataForSeasonsUpTo(
      new FakeSheetsApi(),
      fakeCache('passing'),
      [2013, 2014]
    )

    let playersChances = chance.getPlayerChances(result)

    expect(chance.computeChance(playersChances, 'Víťa')).toBe(81)
    expect(chance.computeChance(playersChances, 'Martin')).toBe(33)
  })
})

describe('historical chances', () => {
  it('does not include the first season as its own history', async () => {
    const api = jest.fn()
    const result = await data.addChanceData({ season: 2013 }, seasonData, api, fakeCache())
    expect(api).not.toHaveBeenCalled()
    const previousChances = Object.values(JSON.parse(result.chancesInPreviousSeasons))
    expect(previousChances).toHaveLength(9)
    expect(previousChances.every(value => value === null)).toBe(true)
  })
})

describe('getPlayersInSeason()', () => {
  it('should work', () => {
    const expectedPlayers = [
      'Martin',
      'Michal',
      'Havli',
      'Vojta m',
      'Pavel',
      'Víťa',
      'Vojta S',
      'Tomas K',
      'Zdenek',
    ]
    expect(chance.getPlayersInSeason(seasonData)).toEqual(expectedPlayers)
  })
})
