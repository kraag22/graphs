const data = require('../app/data.js')
const {MockSheetsApi} = require('./MockSheetsApi.js')
const {mockCache} = require('./MockCache.js')

describe('I should be able to get season data with data.get()', () => {
  afterEach(() => {
    mockCache().clear()
  })

  it('from API', async () => {
    const mockSheetsApi = new MockSheetsApi('2018')
    const result = await data.get(
      () => mockSheetsApi.getSheets(),
      mockCache('failing'),
      '2018')

    expect(Object.keys(result.dataToSave)).toHaveLength(181)
    expect(result.season).toBe('2018')
    expect(result.dataToSave['B6']).toBe('0')
  })

  it('from cache', async () => {
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      mockCache('passing'),
      '2018')

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })

  it('from real cache', async () => {
    const season = '2014'
    const mockSheetsApi = new MockSheetsApi(season)

    // save to cache
    await data.get(
      () => mockSheetsApi.getSheets(),
      mockCache('real'),
      season)

    // dont call api, get from cache
    const result = await data.get(
      () => {
        throw new Error('Should not be called')
      },
      mockCache('real'),
      season)

    expect(Object.keys(result)).toHaveLength(181)
    expect(result['B6']).toBe('0')
  })
})
