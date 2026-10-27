const data = require('../app/data.js')
const { google } = require('googleapis')

afterEach(() => jest.restoreAllMocks())

it('handles an empty Sheets response', async () => {
  const get = jest.fn().mockResolvedValue({ data: {} })
  jest.spyOn(google, 'sheets').mockReturnValue({ spreadsheets: { values: { get } } })
  await expect(data.getSheets(2026)).resolves.toEqual({})
  expect(get).toHaveBeenCalledWith(expect.objectContaining({ range: '2026' }))
})

it('propagates API failures as rejected promises', async () => {
  const error = new Error('Sheets unavailable')
  jest.spyOn(google, 'sheets').mockReturnValue({
    spreadsheets: { values: { get: jest.fn().mockRejectedValue(error) } },
  })
  await expect(data.getSheets(2026)).rejects.toBe(error)
})
