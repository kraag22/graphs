const data = require('../app/data.js')
const { FakeSheetsApi } = require('./FakeSheetsApi.js')
const { fakeCache } = require('./fakeCache.js')
const { getSeasonsUpTo } = require('../app/season.js')

describe('I should be able to get season data with data.get()', () => {
  afterEach(() => {
    fakeCache().clear()
  })

  it('from API', async () => {
    const fakeSheetsApi = new FakeSheetsApi('2018')
    const result = await data.get(
      () => fakeSheetsApi.getSheets(),
      fakeCache('failing'),
      '2018'
    )

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })

  it('from cache', async () => {
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      fakeCache('passing'),
      '2018'
    )

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })

  it('from real cache', async () => {
    const season = '2014'
    const fakeSheetsApi = new FakeSheetsApi(season)

    // save to cache
    await data.get(() => fakeSheetsApi.getSheets(), fakeCache('real'), season)

    // dont call api, get from cache
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      fakeCache('real'),
      season
    )

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })
})

describe('getDataForSeasonsUpTo()', () => {
  it('should work for one season', async () => {
    const fakeSheetsApi = new FakeSheetsApi()
    const result = await data.getDataForSeasonsUpTo(
      fakeSheetsApi,
      fakeCache('passing'),
      [2013]
    )

    expect(Object.keys(result[0].data)).toHaveLength(181)
  })

  it('should work for multiple seasons', async () => {
    const fakeSheetsApi = new FakeSheetsApi()
    const result = await data.getDataForSeasonsUpTo(
      fakeSheetsApi,
      fakeCache('passing'),
      getSeasonsUpTo(2015)
    )

    expect(result[0].season).toBe(2013)
    expect(Object.keys(result[0].data)).toHaveLength(181)
    expect(result[1].season).toBe(2014)
    expect(Object.keys(result[1].data)).toHaveLength(181)
    expect(result[2].season).toBe(2015)
    expect(result).toHaveLength(3)
  })
})
