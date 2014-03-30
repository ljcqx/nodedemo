var bcrypt = require('bcrypt'),
	salt = bcrypt.genSaltSync(10),
	hash = bcrypt.hashSync("B4c0/\/", salt);

console.log(salt);
console.log(hash);
