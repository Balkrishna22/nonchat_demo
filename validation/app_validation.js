const validator = require('./validate');


const registration = (req, res, next) => {
    var validationRule = {};
    validationRule = {
        "name": "required",
        "email": "required|email",
        "password": "required|min:6",
    }
    call_validator(req, res, next, validationRule);
}

const login = (req, res, next) => {
    const validationRule = {
        "email": "required|email",    
        "password": "required|min:6",
    }
    call_validator(req, res, next, validationRule);
}


function call_validator(req, res, next, validationRule) {
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    });
}

function call_validator_get(req, res, next, validationRule) {
    validator(req.query, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    });
}

module.exports = { 

    registration,
    login,
}
