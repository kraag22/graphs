const { once } = require('node:events')
const app = require('../app.js')
const data = require('../app/data.js')
const seasonData = require('./seasonData.json')

let server
let baseUrl

beforeAll(async () => {
  server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

beforeEach(() => {
  jest.spyOn(data, 'get').mockResolvedValue(seasonData)
})

afterEach(() => jest.restoreAllMocks())
afterAll(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
      server.closeAllConnections()
    })
  }
})

it.each(['/', '/mates', '/chance', '/completion'])('renders %s over HTTP', async route => {
  const response = await fetch(`${baseUrl}${route}?season=2018`)
  expect(response.status).toBe(200)
  expect(response.headers.get('set-cookie')).toContain('season=2018')
  expect(await response.text()).toContain('Season 2018/2019')
})

it('returns an error response after an API rejection and serves the next request', async () => {
  data.get.mockRejectedValueOnce(new Error('Sheets unavailable'))
  const failed = await fetch(`${baseUrl}/?season=2018`)
  expect(failed.status).toBe(500)
  await failed.text()
  const recovered = await fetch(`${baseUrl}/?season=2018`)
  expect(recovered.status).toBe(200)
  await recovered.text()
})
