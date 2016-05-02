var express = require('express');
var router = express.Router();
var multer  = require('multer');
var crypto = require('crypto');
var User = require('../models/user');
var List = require('../models/list');
var Reminder = require('../models/reminder');


var app = express();
var server = app.listen(4000);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
	socket.emit('confirmation', { hello: 'world' });

	socket.on('register', function (user) {
		console.log(user); 

	});

	socket.on('authenticate', function(phone, pass){
		console.log("Creating hash of password");
		var hash = crypto
		.createHash("md5")
		.update(new Buffer(password, 'binary'))
		.digest('hex');
		console.log(hash);
	  	console.log(phone);
	  	console.log(pass);
	  	User.getUserByPhone(phone, function(err,user){
	  		if(user.passwordHash === hash){
	  			socket.emit('authenticate',{result: true});
	  		}
	  		else{
	  			socket.emit('authenticate',{result: false});
	  		}
	  	});
	});

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
