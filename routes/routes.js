const user_auth = require('../app/user/auth.js');
const chatting = require('../app/chatting/chat.js')


module.exports = function(app) {
    app.post('/user/registration', user_auth.registration);
    app.post('/user/login', user_auth.login);
    app.get('/user/getall',user_auth.check_auth,user_auth.getall)
    app.post('/user/send_message',user_auth.check_auth,chatting.sendMessage)

   // app.get('/user/get_message',user_auth.check_auth,chatting.getMessage)
}  
    
 
