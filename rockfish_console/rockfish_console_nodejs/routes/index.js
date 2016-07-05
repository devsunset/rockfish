var express = require('express');
var router = express.Router();

//var monk = require('monk');
//var db = monk('localhost:27017/vidzy');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

router.get('/ok', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
router.get('/service', function(req, res) {
    var collection = db.get('videos');
    collection.find({}, function(err, videos){
        if (err) throw err;
      	res.json(videos);
    });
});
*/

module.exports = router;
