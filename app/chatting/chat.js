const db = require('../../config/database');
const chatting = require('../../schema/chatting');
const helpers = require('../../helpers/helpers')

const date = new Date();
const success = true;
const fail = false;


exports.sendMessage = (req, res) => {
    var postData = req.body;  
    var insertData = new chatting({
        message: postData.message,
        from: req.auth._id,
        to: postData.to,
    });
    insertData.save(function (err, result) {
        if (err) {
            res.json({
                status: fail,
                message: 'Messages not sent.',
            });
            res.end();
        } else {
            res.json({
                status: success,
                message: 'Message sent.',
                send: result,
            });
            res.end();
        }
    });
};

// exports.getMessage= (req, res) => {
//     var postData = req.query;
//      chatting.find({
//         $or: [ { from : req.auth._id  }, { from : postData.userId } ,{ to : req.auth._id  }, { to : postData.userId }]      })

// }