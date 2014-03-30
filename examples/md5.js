/**
 * Created by gongchen on 13-12-16.
 */
var crypto = require('crypto');

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

exports.md5 = function (str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
};

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

exports.generateSalt = function () {
	//return uniqid('',true);
};

exports.hashSalt = function () {
	//return md5(this->generateSalt());
}

/**
 exports.md5 = function(str, encoding){
  return crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
};
 */