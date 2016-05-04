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

	socket.on('register', function (name, number, pass) {
		console.log(name); 
		console.log(number);
		console.log(pass);

		socket.emit('register-confirmation',{result: true})
	});

	socket.on('authenticate', function(number, pass){
		console.log("Creating hash of password");
		var hash = crypto
		.createHash("md5")
		.update(new Buffer(pass, 'binary'))
		.digest('hex');
		console.log(hash);
	  	console.log(number);
	  	console.log(pass);
	  	User.getUserByPhone(number, function(err,user){
	  		if(user == null){
	  			console.log('No User found with that phone number');
	  			socket.emit('authenticate-confirmation',{username: false, password:false});
	  		}
	  		else{
	  			console.log('DBs Hash: ' + user.passwordHash);
	  			if(user.passwordHash === hash){
	  				console.log('Passwords match')
	  				socket.emit('authenticate-confirmation',{username: true, password: true});
		  		}
		  		else{
		  			console.log('Mismatch with passwords');
		  			socket.emit('authenticate-confirmation',{username:true, password: false});
		  		}
	  		}
	  	});
	});

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
