var express = require('express')
var favicon = require('serve-favicon')
var morgan = require('morgan')
var errorhandler = require('errorhandler')
var router = express.Router()
var routes = require('./routes/routes.js')
var http = require('http')
var path = require('path')
var cookieParser = require('cookie-parser')

require('dotenv').config({ quiet: true })
var app = express()

// all environments
app.set('port', process.env.PORT || process.env.VCAP_APP_PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

router.get('/', routes.totals)
router.get('/mates', routes.mates)
router.get('/chance', routes.chance)
router.get('/completion', routes.completion)

app.use(router)

// Express 5 forwards rejected route promises to error middleware.
if ('development' === app.get('env')) {
  app.use(errorhandler())
}

if (require.main === module) {
  http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
  })
}

module.exports = app
