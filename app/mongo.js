var mongoose = require('mongoose');

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

  params.season = season;

  this.findOne(params, cb);
};

exports.getTodayData = function(season) {
  const promise = new Promise((resolve, reject) => {
    var data = mongoose.model('dataModel', dataSchema)

    data.getTodayData(season, function(err, data){
      if (err) {
        reject(err);
      }
      else {
        if (data === null) {
          resolve(false);
        }
        else {
          resolve(data.data);
        }
      }
    })
  })

  return promise
}

exports.saveData = function(data) {
  const promise = new Promise((resolve, reject) => {
    var Data = mongoose.model('dataModel', dataSchema);

    var newData = new Data();

    newData.data = data.dataToSave;
    newData.createdAt = new Date();
    if (data.season !== 0) {
      newData.season = data.season;
    }
    newData.markModified('data');

    newData.save(function() {
      console.log('Data saved to MongoDB');
      resolve(data.dataToSave);
    });
  })
  return promise;
};
