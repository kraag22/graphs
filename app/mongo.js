var mongoose = require('mongoose');
var Q        = require('q');

var dataSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  season: mongoose.Schema.Types.Mixed,
  data: mongoose.Schema.Types.Mixed
});

dataSchema.statics.getTodayData = function (season, cb) {
  var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,0,0,0);
  var params = {createdAt: {$gte: start, $lt: end}};
  // add filter to season, if is not first one(that doesnt have season column)
  if (season !== 0) {
    params.season = season;
  }
  this.findOne(params, cb);
};

exports.getTodayData = function(season) {

  var deffered = Q.defer();

  var data = mongoose.model('dataModel', dataSchema);

  data.getTodayData(season, function(err, data){

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

exports.saveData = function(data) {
  var deffered = Q.defer();

  var Data = mongoose.model('dataModel', dataSchema);

  var newData = new Data();

  newData.data = data.dataToSave;
  newData.createdAt = new Date();
  if (data.season !== 0) {
    newData.season = data.season;
  }
  newData.markModified('data');

  newData.save(function() {
    console.log('returned from saveData()');
    deffered.resolve(data.dataToSave);
  });

  return deffered.promise;
};