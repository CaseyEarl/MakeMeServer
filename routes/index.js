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

	//socket.id
	socket.emit('confirmation', { hello: 'world' });

	socket.on('create-list', function(name, number, to){
		console.log(name);
		console.log(number);
		console.log(to);
		var toOther = to;
		console.log(toOther);
		User.getUserByPhone(number, function(err,user){
			if(user){
				var newList = new List({
					title:name,
					to:toOther,
					from:user._id,
					remindersList:null,
					index:0,
				});
				console.log(newList);
				List.saveList(newList,function(err, list){
					if(err) throw err;
					//socket.emit('update-list',{id:list.id});
				});
			}
			
		});
		
		
		
	});

	socket.on('create-reminder', function(name, number, listID, alarm){
		console.log(name);
		console.log(number);
		console.log(listID);
		console.log(alarm);

		var newReminder = new Reminder({
			name:name,
			alarm:alarm,
			index:number,
		});
		
		Reminder.saveReminder(newReminder, function(err,reminder){
			if(err) throw err;
			//socket.emit('update-')
			List.getListbyId(listID, function(err,list){
				if(list == null){
					console.log('Error list not found with ID: ' + listID);
				}
				else{
					list.remindersList.push(reminder._id);
				}
			});
		});

		

	});

	socket.on('register', function (name, number, pass) {
		console.log(name);
		console.log(number);
		console.log(pass);
		User.getUserByPhone(number, function(err,user){
			if(user==null){
				var hash = crypto
				.createHash("md5")
				.update(new Buffer(pass, 'binary'))
				.digest('hex');
				var newUser = new User({
					name:name,
					phoneNumber:number,
					passwordHash:hash

				});
				console.log(hash);
				
				User.registerUser(newUser, function(err, user){
					if(err) throw err;
						socket.emit('register-confirmation',{result: false});
				});
				User.addConnectedUser(socket.id, number);
				
				socket.emit('register-confirmation',{result: true});
			}
			else{
				socket.emit('register-confirmation',{result: false});
			}	
		})

		
		//remember to check for the user already existed
	});

	/*******************************************
	Authenticating User on Sign in
	********************************************/
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
	  				console.log('Passwords match');
	  				User.addConnectedUser(socket.id,user.phoneNumber);
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
