var mongoose = require('mongoose');
var crypto = require('crypto');
var bodyParser = require('body-parser');
mongoose.set('debug', true);

var Schema = mongoose.Schema;

var reminderSchema = new Schema(
	{
		task: String,
		alarm: Date,
		index: Number,
	},
	{
        timestamps: {createdAt: 'creation_date', completed: 'last_modified'}
    }
);

var Reminder = module.exports = mongoose.model('Reminder', reminderSchema);

module.exports.saveReminder = function(newReminder, callback){
	newReminder.save(callback);
};