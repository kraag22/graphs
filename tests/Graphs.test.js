const { Graphs } = require('../public/javascripts/Graphs.js')

let defaultData = {
  A1: '',
  B1: 'Martin',
  C1: 'Michal',
  D1: 'Martina',
  E1: 'Havli',
  F1: 'Vojta m',
  G1: 'Pavel',
  H1: 'Víťa',
  I1: 'Vojta',
  J1: 'Tomas K',
  A2: '13.9.2021',
  B2: '',
  C2: '0',
  D2: '',
  E2: '1',
  F2: '1',
  G2: '0',
  H2: '1',
  I2: '',
  J2: '0',
  A3: '20.9.2021',
  B3: '0',
  C3: '0',
  D3: '0',
  E3: '1',
  F3: '0',
  G3: '1',
  H3: '1',
  I3: '1',
  J3: '0',
  A4: '4.10.2021',
  B4: '0',
  C4: '1',
  D4: '1',
  E4: '0',
  F4: '',
  G4: '0',
  H4: '',
  I4: '1',
  A5: '11.10.2021',
  B5: '',
  C5: '1',
  D5: '0',
  E5: '1',
  F5: '1',
  G5: '0',
  H5: '1',
  I5: '0',
  J5: '0',
  A6: '18.10.2021',
  B6: '',
  C6: '1',
  D6: '',
  E6: '0',
  F6: '1',
  G6: '0',
  H6: '0',
  I6: '',
  J6: '1',
  A7: '25.10.2021',
  B7: '0',
  C7: '1',
  D7: '0',
  E7: '1',
  F7: '1',
  G7: '0',
  H7: '0',
  A8: '1.11.2021',
  B8: '0,5',
  C8: '0.5',
  D8: '0.5',
  E8: '0.5',
  F8: '',
  G8: '0.5',
  H8: '0,5',
  I8: '',
  J8: '0.5',
  A9: '25.10.2021',
  B9: '0',
  C9: '1',
  D9: '0',
  E9: '1',
  F9: '1',
  G9: '0',
  H9: '0',
  A10: '25.10.2021',
  B10: '0',
  C10: '1',
  D10: '0',
  E10: '1',
  F10: '1',
  G10: '0',
  H10: '0',
  A11: '25.10.2021',
  B11: '0',
  C11: '1',
  D11: '0',
  E11: '1',
  F11: '1',
  G11: '0',
  H11: '0',
  A12: '25.10.2021',
  B12: '0',
  C12: '1',
  D12: '0',
  E12: '1',
  F12: '1',
  G12: '0',
  H12: '0',
}

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
