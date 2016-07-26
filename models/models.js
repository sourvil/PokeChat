var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: {type: Date, default: Date.now}
});

var chatSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    message: String
});

var tipSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdAt: {type: Date, default: Date.now},
    content: String
});

mongoose.model('User', userSchema);
mongoose.model('Chat', chatSchema);
mongoose.model('Tip', tipSchema);