/*
 * POST: up and downvoting images.
 */
exports.vote = function(req, res){

	console.log(req.body);
  res.json({'voted': 'chyeah'});
};