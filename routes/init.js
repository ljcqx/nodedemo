/**
 * Created by gongchen on 14-3-14.
 */
var User = require('../models').User;
exports.install = function(req, res) {
    var user = new User({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'CY9rzUYh03PK3k6DJie09g==',
        actived: true
    });
    user.save();
    res.send('Data inited');
};
