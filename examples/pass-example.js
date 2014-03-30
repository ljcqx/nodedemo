/**
 * Created by gongchen on 14-3-27.
 */
var hash = require('./password');

console.log(hash.hash('admin'));
console.log(hash.md5('uqwsyOT5c'));
console.log(hash.md5('admin'));
console.log(hash.md5(hash.md5('admin')+'3b418oGN82'));
console.log(hash.md5('21232f297a57a5a743894a0e4a801fc3DLMUKmlAQA'));
console.log(Date.now());
console.log(new Date());
