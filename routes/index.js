/*
 * GET home page.
 */

exports.page = function(req, res){
  res.render('index', { title: 'Express' });
};
