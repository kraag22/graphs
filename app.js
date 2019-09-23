var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');
  if(obj.username && obj.password){
    return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
  }
  else{
    return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
  }
};

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var total = require('./routes/total');
var mates = require('./routes/mates');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/totals', total.list);
app.get('/mates', mates.list);


var mongo;

if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  mongo = env['mongodb2-2.4.8'][0].credentials;
}
else{
  mongo = {
    'hostname':'localhost',
    'port':27017,
    'username':'',
    'password':'',
    'name':'',
    'db':'db'
  };
}

var mongoUrl = generate_mongo_url(mongo);
console.log(mongoUrl);

mongoose.connection.on('connected', function () {
  console.log('Connected to mongo server.');

  var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});

mongoose.connection.on('error', function (e) {
  console.log(e);
  console.log('Could not connect to mongo server!');
});

mongoose.connect(mongoUrl);
