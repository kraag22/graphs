var mongoose = require('mongoose');
var Q        = require('q');

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

exports.getTodayData = function() {

  var deffered = Q.defer();

  var data = mongoose.model('dataModel', dataSchema);

  data.getTodayData(function(err, data){

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