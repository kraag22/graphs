const data = require('../app/data.js')
const routes = require('../routes/routes.js')
const pug = require('pug')
const path = require('node:path')

afterEach(() => jest.restoreAllMocks())

it('keeps data and labels from concurrent requests in the same season', async () => {
  const pending = {}
  jest.spyOn(data, 'get').mockImplementation((api, cache, selected) =>
    new Promise(resolve => { pending[selected] = resolve })
  )
  const first = { cookie: jest.fn(), render: jest.fn() }
  const second = { cookie: jest.fn(), render: jest.fn() }
  const a = routes.totals({ query: { season: '2018' } }, first)
  const b = routes.totals({ query: { season: '2019' } }, second)
  pending[2019]({ B1: 'Second' })
  pending[2018]({ B1: 'First' })
  await Promise.all([a, b])
  expect(first.render).toHaveBeenCalledWith('totals', expect.objectContaining({
    season: 2018, data: '{"B1":"First"}',
  }))
  expect(second.render).toHaveBeenCalledWith('totals', expect.objectContaining({
    season: 2019, data: '{"B1":"Second"}',
  }))
})

it('renders spreadsheet text without letting it terminate inline scripts', async () => {
  const text = '</script><script>alert(1)</script>\u2028\u2029'
  jest.spyOn(data, 'get').mockResolvedValue({ B1: text })
  const res = { cookie: jest.fn(), render: jest.fn() }
  await routes.totals({ query: { season: '2018' } }, res)
  const settings = res.render.mock.calls[0][1]
  expect(JSON.parse(settings.data).B1).toBe(text)
  const html = pug.renderFile(path.join(__dirname, '../views/totals.pug'), settings)
  expect(html).not.toContain(text)
  expect(html).toContain('\\u003c/script>')
})
