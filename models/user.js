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

module.exports.getUserByPhone = function(phone, callback){
	console.log(phone);
	User.findOne({phoneNumber:phone},callback);
	//User.findOne({email:"caseyearl@outlook.com"},callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	console.log("Password User entered:");
	console.log(candidatePassword);
	console.log("Database Password:");
	console.log(hash);

	if(candidatePassword === hash) return callback(null, true);
	else return callback(null,false);

	//User.findOne({email:"caseyearl@outlook.com"},callback);
};


//use users
//db.createCollection('users');
//db.users.insert({first_name:"Casey",last_name:"Earl",password_hash:"abcde",email:"caseyearl@outlook.com",username:"caseyearl@outlook.com"});
