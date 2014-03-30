/**
 * Created by gongchen on 14-3-27.
 */
var crypto = require('crypto');

var SaltLength = 10;

function createHash(password) {
    var salt = generateSalt(SaltLength);
    var hash = md5(md5(password) + salt);
    return salt + hash;
}

function validateHash(hash, password) {
    var salt = hash.substr(0, SaltLength);
    var validHash = salt + md5(md5(password) + salt);
    return hash === validHash;
}

function generateSalt(len) {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

function hashSalt() {
    return generateSalt(SaltLength);
}

module.exports = {
    'crateHash': createHash,
    'validateHash': validateHash,
    'md5': md5,
    'generateSalt': generateSalt,
    'hashSalt': hashSalt
};

/*
 var crypto = require('crypto'),
 salt = crypto.randomBytes(128).toString('base64'),
 key;
 crypto.pbkdf2( 'password', salt, 10000, 512, function(err, dk) { key = dk; } );
 */

exports.encrypt = function (str, secret) {
    var cipher = crypto.createCipher('aes192', secret),
        enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

exports.decrypt = function (str, secret) {
    var decipher = crypto.createDecipher('aes192', secret),
        dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

/*
exports.md5 = function (str) {
   return md5sum = crypto.createHash('md5').uppdate(str).digest('hex');
};
*/

/*
 exports.md5 = function(str, encoding){
 return crypto
 .createHash('md5')
 .update(str, 'utf8')
 .digest(encoding || 'hex');
 };
 */

exports.randomString = function (size) {
    size = size || 6;
    var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890',
        max_num = code_string.length + 1,
        new_pass = '';
    while(size > 0) {
        new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
        size--;
    }
    return new_pass;
};





