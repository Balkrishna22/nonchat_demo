var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

var chattingSchema = new Schema({
    from: { type: ObjectId, required: true },
    to: { type: ObjectId, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'HOLD'},
    created_at: { type: Date },
    updated_at: { type: Date },
});

var chatting = mongoose.model('chatting', chattingSchema);

module.exports = chatting;
