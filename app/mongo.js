var mongoose = require('mongoose');
var Q        = require('q');

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

var dataSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  data: mongoose.Schema.Types.Mixed
});

dataSchema.statics.getTodayData = function (cb) {
  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,0,0,0);

  this.findOne({createdAt: {$gte: start, $lt: end}}, cb);
};

exports.connect = function() {

  var deffered = Q.defer();

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
  console.log('will connect');
  var mongoUrl = generate_mongo_url(mongo);
  console.log(mongoUrl);

  mongoose.connection.on('connected', function () {
    console.log('Connected to mongo server.');
    deffered.resolve();
  });
  mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
    deffered.reject(err);
  });

  mongoose.connect(mongoUrl);

  return deffered.promise;
};

exports.close = function() {

  var deffered = Q.defer();

  mongoose.disconnect(function(){
    console.log('connection closed');
    deffered.resolve();
  });

  return deffered.promise;
};

exports.getTodayData = function() {

  var deffered = Q.defer();

  var data = mongoose.model('dataModel', dataSchema);

  data.getTodayData(function(err, data){
    console.log('error from isData()',err);
    if (err) {
      deffered.reject(err);
    }
    else {
      if (data === null) {
        deffered.resolve(false);
      }
      else {
        deffered.resolve(data.data);
      }
    }

  });

  return deffered.promise;

};

exports.saveData = function(dataToSave) {
  var deffered = Q.defer();

  var Data = mongoose.model('dataModel', dataSchema);

  var newData = new Data();

  newData.data = dataToSave;
  newData.createdAt = new Date();
  newData.markModified('data');

  newData.save(function() {
    console.log('returned from saveData()');
    deffered.resolve(dataToSave);
  });

  return deffered.promise;
};