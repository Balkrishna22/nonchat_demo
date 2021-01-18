const db = require('../../config/database');
const user = require('../../schema/users');
const helpers = require('../../helpers/helpers')
const formidable = require('formidable');
const fs = require('fs');

const date = new Date();
const success = true;
const fail = false;


exports.registration = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, field, files) {
        var name = Date.now() + '.' + files.addImage.name.split(".")[1];
        var oldpath = files.addImage.path;
        var newpath = 'uploads/images/' + name;
        ensureDirSync('uploads/images/')

        const query = user.findOne({ email: field.email });
        query.exec(function (err, result) {
            if (result) {
                if (err) {
                    res.json({
                        "status": fail,
                        'message': 'Something went wrong.',
                    });
                    res.end();
                } else {
                    res.json({
                        "status": fail,
                        'message': 'Email already exists.',
                    });
                    res.end();
                }
            } else {
                fs.rename(oldpath, newpath, function (err) {
                    if (err) {
                        res.json({
                            "status": fail,
                            'message': 'Something went wrong.',
                        });
                        res.end();
                    } else {
                        var authToken =
                            'user_' + helpers.randomAsciiString(300) + '_' + new Date().getTime();
                        insertData = new user({
                            userName: field.userName,
                            email: field.email,
                            password: helpers.encrypt(field.password),
                            addImage: name,
                            authToken: authToken,
                        });
                        var validation = checkEmail(field);
                        if (validation == true) {

                            insertData.save(function (err, userData) {
                                console.log(err);
                                if (err) {
                                    res.json({
                                        "status": fail,
                                        'message': 'Something went wrong.',
                                    });
                                    res.end();
                                } else {
                                    res.json({
                                        'status': success,
                                        'message': 'Registration successfully done.',
                                        'data': userData,
                                    });
                                    res.end();
                                }
                            })
                        } else {
                            res.json({
                                status: fail,
                                message: 'Please insert a valid email address.',
                            });
                            res.end();
                        }
                    }
                })
            }
        })
    })
}


exports.login = function (req, res) {
    var postData = req.body;
    var authToken = 'user_' + helpers.randomAsciiString(300) + '_' + new Date().getTime();
    query = user.findOne({ email: postData.email }, ['name', 'email', 'password']);
    query.exec(function (err, users) {
        if (err) {
            res.json({
                status: fail,
                message: 'Something went wrong.',
            });
            res.end();
        } else {
            if (users) {
                if (helpers.decrypt(users.password) == postData.password) {
                    user.updateOne(
                        { email: postData.email },
                        { authToken: authToken },
                        function (err) {
                            if (err) {
                                res.json({
                                    status: fail,
                                    message: "Try again later..!",
                                    data: {},
                                });
                                res.end();
                            } else {
                                users.authToken = authToken; // we get data before update authtoken
                                delete users.password;
                                res.json({
                                    status: success,
                                    message: "Login successfully.",
                                    data: users,
                                });
                                res.end();
                            }
                        }
                    );
                } else {
                    res.json({
                        status: fail,
                        message: 'Invalid login credentials.',
                    });
                    res.end();
                }
            } else {
                res.json({
                    status: fail,
                    message: 'Invalid login credentials.',
                });
                res.end();
            }
        }
    });
};

exports.getall = function (req, res) {
    getData = req.auth
    user.find({ email: { $ne: getData.email } }).exec(
        function (err, result) {
            if (err) {
                res.json({
                    status: fail,
                    message: 'Something went wrong.',
                });
            } else {
                console.log(result.length);
                if(result.length > 0){
                    res.json({
                        status: success,
                        message: 'users you can chat with.',
                        data: result
                    });
                }else{
                    res.json({
                        status: success,
                        message: 'Ohpss no users found .',
                       // data: result
                    });
                }
                
            }
        }
    )
}


exports.check_auth = function (req, res, next) {
    if (req.headers.authorization) {
        var query = user.findOne({
            authToken: req.headers.authorization,
        });
        query.exec(function (err, users) {
            if (err) {
                res.status(400).json({
                    status: fail,
                    message: 'Authorization failed.',
                    data: {},
                });
                res.end();
            } else {
                if (users) {
                    req.auth = users
                    next();
                } else {
                    res.status(400).json({
                        status: fail,
                        message: 'Authorization failed.',
                        data: {},
                    });
                    res.end();
                }
            }
        });
    } else {
        res.status(400).json({
            status: fail,
            message: 'Authorization token required.',
            data: {},
        });
        res.end();
    }
};


function checkEmail(postData) {
    var emailreg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{3,5})$/;
    if (emailreg.test(postData.email)) {
        return true;
    } else {
        return false;
    }
}

function ensureDirSync(dirpath) {
    try {
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath);
            return true;
        }
    } catch (err) {
        if (err.code !== 'EXIST') {
            return false;
        }
    }
}