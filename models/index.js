/**
 * Created by gongchen on 14-3-13.
 */
var mongoose = require('mongoose'),
    config = require('../config');

mongoose.connect(config.mongodb, function(err) {
    if(err) {
        console.error('connect to %s error: ', config.mongodb, err.message);
        process.exit(1);
    }
    console.log('Successfully connected to MongoDB')
})

require('./user');
require('./friends');

exports.User = mongoose.model('User');
exports.Friends = mongoose.model('Friends');