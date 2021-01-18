let url = 'mongodb://localhost:27017/chat_data_new';

var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

var client = mongoose.connection;

client.on("error", console.error.bind(console, "connection error"));
client.once("open", function(callback) {
    console.log("Connection succeeded.");
});

module.exports = client;