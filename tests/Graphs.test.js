const {Graphs} = require('../public/javascripts/Graphs.js')

describe('Graphs', () => {
  it('init() should work', async () => {
    const g = new Graphs([])
    expect(g.numberOfPlays).toBe(0)
    expect(g.plays_).toEqual([])
  })
})
