var request = require('request');

/*
 * Routes for dealing with instagram go here.
 *
 */




/*
 * Perform handshake with instagram.
 *
 */

app.get('/callback', function(request, response){
  response.send(request.query['hub.challenge']);
});

/*
 * Respond to callback from instagram
 *
 */

app.post('/callback', function(req, res){
  // request recent photos with this tag
  request('https://api.instagram.com/v1/tags/' + req.body[0].object_id + '/media/recent?client_id=54a06ba8e25540f19c2cebf8937697d8',       
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].type == 'image') {
            // data[i] is a photo obj
            // data[i].id will be our database _id to avoid duplicates
          }
        }
      }
    });
  res.send('Thanks');

});