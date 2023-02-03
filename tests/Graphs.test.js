const { Graphs } = require('../public/javascripts/Graphs.js')
const defaultData = require('./graphData.json')

describe('Graphs', () => {
  it('init() should work', async () => {
    const g = new Graphs([])
    expect(g.numberOfPlays).toBe(0)
    expect(g.plays_).toEqual([])
  })

  it('getActiveColumnsLetters() should work', () => {
    const g = new Graphs(defaultData)
    const result = g.getActiveColumnsLetters()
    expect(result).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'])
  })

  it('getPlayerName() should work', () => {
    const g = new Graphs(defaultData)
    expect(g.getPlayerName('B')).toEqual('Martin')
    expect(g.getPlayerName('J')).toEqual('Tomas K')
    expect(g.getPlayerName('Q')).toEqual(false)
  })

  it('getIndexOfLastGame() should work', () => {
    const g = new Graphs(defaultData)
    expect(g.getIndexOfLastGame()).toEqual(12)
  })

  it('getIndexOfLastGame() should work on empty data', () => {
    const g = new Graphs({})
    expect(g.getIndexOfLastGame()).toEqual(0)
  })

  it('getWithAgainstStat() should work', () => {
    const g = new Graphs(defaultData)
    expect(g.getWithAgainstStat('B', 'C')).toEqual({
      with: 2,
      against: 6,
      lostWith: 1,
      wonWith: 0,
    })
    expect(g.getWithAgainstStat('Q', 'C')).toEqual({
      with: 0,
      against: 0,
      lostWith: 0,
      wonWith: 0,
    })
    expect(g.getWithAgainstStat('E', 'C')).toEqual({
      with: 7,
      against: 4,
      lostWith: 0,
      wonWith: 6,
    })
  })

  it('gameResultForPlayer() should work', () => {
    const g = new Graphs(defaultData)
    expect(g.gameResultForPlayer('Q', '2')).toEqual(g.ABSENT)
    expect(g.LOSS).toEqual(0)
    expect(g.gameResultForPlayer('B', '3')).toEqual(g.LOSS)
    expect(g.gameResultForPlayer('B', '2')).toEqual(g.ABSENT)
    expect(g.gameResultForPlayer('E', '2')).toEqual(g.WIN)
    expect(g.gameResultForPlayer('B', '8')).toEqual(g.TIE)
    expect(g.gameResultForPlayer('C', '8')).toEqual(g.TIE)
  })
})

describe('mates', () => {
  it('matesDataForPlayer() should work', () => {
    const g = new Graphs(defaultData)
    const result = g.matesDataForPlayer('B')
    expect(result['E'].with).toEqual(2)
    expect(result['E'].against).toEqual(6)
    expect(result['J'].with).toEqual(2)
    expect(result['J'].against).toEqual(0)
  })

  it('matesDataForPlayer() should fail gracefully', () => {
    const g = new Graphs(defaultData)
    const result = g.matesDataForPlayer('Q')

    expect(result['B']).toEqual({
      with: 0,
      against: 0,
      lostWith: 0,
      wonWith: 0,
    })
    expect(result['I']).toEqual({
      with: 0,
      against: 0,
      lostWith: 0,
      wonWith: 0,
    })
    expect(result['E']).toEqual({
      with: 0,
      against: 0,
      lostWith: 0,
      wonWith: 0,
    })
  })

  it('prepareMatesData should work for -> played', () => {
    const g = new Graphs(defaultData)
    const data = g.matesDataForPlayer('B')
    const result = g.prepareMatesData(data, 'played')

    expect(result.length).toEqual(8)
    expect(result[0]).toEqual({ name: 'Michal', first: 6, second: 2 })
    expect(result[6]).toEqual({ name: 'Vojta', first: 2, second: 0 })
  })

  it('prepareMatesData should work for -> succeeded', () => {
    const g = new Graphs(defaultData)
    const data = g.matesDataForPlayer('G')
    const result = g.prepareMatesData(data, 'succeeded')

    expect(result.length).toEqual(8)
    expect(result[4]).toEqual({ name: 'Vojta m', first: 0, second: 0 })
    expect(result[7]).toEqual({ name: 'Tomas K', first: 2, second: 0 })
  })
})

describe('totals', () => {
  it('getWinsAndLosses() should work', () => {
    const g = new Graphs(defaultData)
    const result = g.getWinsAndLosses()

    expect(result).toHaveLength(9)
    expect(result[3].looses).toEqual(2)
    expect(result[3].wins).toEqual(8.5)
  })
})
