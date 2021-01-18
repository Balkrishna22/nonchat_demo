
const crypto = require('crypto');
var fs = require('fs');

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

function encrypt(password) {
    var mykey = crypto.createCipher(
        'aes-128-cbc',
        'chatting_key_of_encryption'
    );
    var mystr = mykey.update(password, 'utf8', 'hex');
    mystr += mykey.final('hex');
    return mystr;
}

function decrypt(password) {
    var mykey = crypto.createDecipher(
        'aes-128-cbc',
        'chatting_key_of_encryption'
    );
    var mystr = mykey.update(password, 'hex', 'utf8');
    mystr += mykey.final('utf8');
    return mystr;
}

function randomAsciiString(length) {
    return randomString(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
}

function randomString(length, chars) {
  if (!chars) {
    throw new Error("Argument 'chars' is undefined");
  }

  var charsLength = chars.length;
  if (charsLength > 256) {
    throw new Error(
      "Argument 'chars' should not have more than 256 characters" +
        ", otherwise unpredictability will be broken"
    );
  }

  var randomBytes = crypto.randomBytes(length);
  var result = new Array(length);
  var cursor = 0;

  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % charsLength];
  }
  return result.join("");
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

exports.generateOTP = generateOTP
exports.encrypt = encrypt
exports.decrypt = decrypt
exports.randomString = randomString
exports.randomAsciiString = randomAsciiString
exports.ensureDirSync = ensureDirSync