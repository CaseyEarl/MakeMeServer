var mongoose = require('mongoose');
var crypto = require('crypto');
var bodyParser = require('body-parser');
mongoose.set('debug', true);

var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		name: String,
		phoneNumber: String,
		passwordHash:String,
	},
	{
        timestamps: {createdAt: 'creation_date', updatedAt: 'last_modified'}
    }
);

var User = module.exports = mongoose.model('User', userSchema);

module.exports.registerUser = function(newUser, callback){
	newUser.save(callback);
};

/*****************************************************************************
Querries the user based off a phone number which should be a unique identifier
*****************************************************************************/
module.exports.getUserByPhone = function(phone, callback){
	console.log(phone);
	User.findOne({phoneNumber:phone},callback);
	//User.findOne({email:"caseyearl@outlook.com"},callback);
};

/*****************************************************************************
Compares the password passed from the user to the password from the database and a true or false is
returned. Candidate password is already hashed.
*****************************************************************************/
module.exports.comparePassword = function(candidatePassword, hash, callback){
	console.log("Password User entered:");
	console.log(candidatePassword);
	console.log("Database Password:");
	console.log(hash);

	if(candidatePassword === hash) return callback(null, true);
	else return callback(null,false);
};



//Connected Users will be a dictionary of the currently connected users
var connectedUsers = {};
//
var numberOfConnectedUsers = 0;

function addConnectedUser(socket, phone) {
	console.log('NEW CONNECTION')
	console.log('Users phone: ', phone);
	console.log('Users socket: ', socket);
	numberOfConnectedUsers++;
	console.log('Current number of connectedUsers: ', numberOfConnectedUsers);
    if(!(phone in connectedUsers)) {
        connectedUsers[phone]=[socket];
    }
    else{
    	connectedUsers[phone].push(socket);
    }
    console.log('Connected Users Table:')
    for(var key in connectedUsers){
    	console.log(connectedUsers[key]);
    }
}

module.exports.addConnectedUser = addConnectedUser;
module.exports.connectedUsers = connectedUsers;
module.exports.numberOfConnectedUsers = numberOfConnectedUsers;