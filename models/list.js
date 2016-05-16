var mongoose = require('mongoose');
var crypto = require('crypto');
var bodyParser = require('body-parser');
mongoose.set('debug', true);

var Schema = mongoose.Schema;

var listSchema = new Schema(
	{
		title: String,
		remindersList:[{type: Schema.Types.ObjectId, ref: 'Reminder'}],
		to: {type: Schema.Types.ObjectId, ref: 'User'},
		from: {type: Schema.Types.ObjectId, ref: 'User'},
		index: Number,
	},
	{
        timestamps: {createdAt: 'creation_date', completed: 'last_modified'}
    }
);

var List = module.exports = mongoose.model('List', listSchema);

module.exports.saveList = function(newList, callback){
	newList.save(callback);
};