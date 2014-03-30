var crypto = require('crypto'),
	salt = crypto.randomBytes(128).toString('base64'),
	key;

crypto.pbkdf2('password', salt, 10000, 512, function(err, dk) {
	key = dk;
	//console.log(key);
});
//console.log(crypto.randomBytes(5).toString('md5'));
