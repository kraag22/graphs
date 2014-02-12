
/*
 * GET users listing.
 */

exports.list = function(req, res){

  res.render('total', { title: 'Express', data: 'ahoj' });
};