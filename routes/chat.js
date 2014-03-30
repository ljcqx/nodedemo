/**
 * Created by gongchen on 14-3-13.
 */

exports.index = function(req, res) {
    res.render('chat/index', {name: 'Chat', user_id: req.session.user_id, username: req.session.username});
};

exports.list = function(req, res) {
    res.render('chat/index');
}