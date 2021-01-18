var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    addImage: { type: String, required: true },
    status: { type: String, default: 'ACTIVE' }, // ACTIVE, INACTIVE
    authToken : {type: String, required: true},
    created_at: { type : Date },
    updated_at: { type : Date },


});

var user = mongoose.model('user', userSchema);

module.exports = user;























