var express = require('express');
var router = express.Router();
var multer  = require('multer');
var crypto = require('crypto');
var User = require('../models/user');


var app = express();
var server = app.listen(4000);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
	socket.emit('confirmation', { hello: 'world' });

	socket.on('register', function (user) {
		console.log(user);

	});

	socket.on('authenticate', function(user){
	  	console.log(user);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
