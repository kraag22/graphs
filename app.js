var express = require('express');
var favicon = require('serve-favicon')
var morgan = require('morgan')
var errorhandler = require('errorhandler')
var router = express.Router()
var routes = require('./routes');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');

require('dotenv').config();
var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(morgan('dev'))
app.use(cookieParser());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(errorhandler())
}

router.get('/', routes.index);
router.get('/totals', routes.totals);
router.get('/mates', routes.mates);

app.use(router)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
