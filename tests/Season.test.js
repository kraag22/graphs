const season = require('../app/season.js')

describe('Season', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-27T12:00:00'))
  })
  afterEach(() => jest.useRealTimers())

  it('keeps selections local to the request', () => {
    const res = { cookie: jest.fn() }
    expect(season.set({ query: { season: '2018' } }, res)).toBe(2018)
    expect(season.set({ cookies: { season: '2019' } }, res)).toBe(2019)
    expect(season.set({}, res)).toBe(2026)
    expect(season.get()).toBe(2026)
  })

  it.each(['2018junk', 'NaN', '2012', '9999', ['2018'], {}])(
    'ignores an invalid query or cookie season: %j', value => {
      const res = { cookie: jest.fn() }
      expect(season.set({ query: { season: value }, cookies: { season: value } }, res)).toBe(2026)
      expect(res.cookie).not.toHaveBeenCalled()
    }
  )

  it('updates the default season when September begins', () => {
    jest.setSystemTime(new Date('2026-08-31T12:00:00'))
    expect(season.get()).toBe(2025)
    jest.setSystemTime(new Date('2026-09-01T12:00:00'))
    expect(season.get()).toBe(2026)
  })
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
