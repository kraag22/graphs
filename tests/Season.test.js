const season = require('../app/season.js')

describe('Season', () => {
  it('getFirstSeason() should work', () => {
    expect(season.getFirstSeason()).toBe(2013)
  })

  it('getSeasonsUpTo() should work', () => {
    expect(season.getSeasonsUpTo(2018)).toEqual([
      2013, 2014, 2015, 2016, 2017, 2018,
    ])
  })

  it('getSeasonsUpTo() should work with only one result', () => {
    expect(season.getSeasonsUpTo(2013)).toEqual([2013])
  })
})
