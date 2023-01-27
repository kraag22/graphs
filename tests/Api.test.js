const data = require('../app/data.js')
const {FakeSheetsApi} = require('./FakeSheetsApi.js')
const {fakeCache} = require('./fakeCache.js')

describe('I should be able to get season data with data.get()', () => {
  afterEach(() => {
    fakeCache().clear()
  })

  it('from API', async () => {
    const fakeSheetsApi = new FakeSheetsApi('2018')
    const result = await data.get(
      () => fakeSheetsApi.getSheets(),
      fakeCache('failing'),
      '2018')

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })

  it('from cache', async () => {
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      fakeCache('passing'),
      '2018')

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })

  it('from real cache', async () => {
    const season = '2014'
    const fakeSheetsApi = new FakeSheetsApi(season)

    // save to cache
    await data.get(
      () => fakeSheetsApi.getSheets(),
      fakeCache('real'),
      season)

    // dont call api, get from cache
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      fakeCache('real'),
      season)

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })
})
