
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('user', { title: 'Express', data: 'ahoj' });
};