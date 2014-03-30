
/*
 * GET home page.
 */
var chat = require('./chat'),
    user = require('./user'),
    init = require('./init'),
    friends = require('./friends'),
    User = require('../models').User;

module.exports = function(app) {
    app.get('/install', init.install);
    app.get('/', authenticate, chat.index);
    app.get('/login', user.login);
    app.post('/login', user.dologin);

    app.get('/register', user.register);
    app.post('/register.:format?', user.doregister);

    app.get('/users', user.list);

    app.get('/logout', user.logout);

    app.get('/api/user/:id');

    app.get('/friends/search', friends.search);
    app.post('/friends/search', friends.findbyname);
    app.post('/friends/add', friends.add);

};

function authenticate (req, res, next) {
    if(req.session.user_id) {
        User.findById(req.session.user_id, function(err, user) {
            if(user) {
                req.currentUser = user;
                next();
            }else{
                res.redirect('/login');
            }
        });
    }else if(req.cookies.logintoken) {
        authenticateFromLoginToken(req, res, next);
    }else{
        res.redirect('/login');
    }
}

function authenticateFromLoginToken(req, res, next) {
    var cookie = JSON.parse(req.cookies.logintoken);

    LoginToken.findOne({
        email: cookie.email,
        series: cookie.series,
        token: cookie.token
    }, function(err, token) {
        if(!token) {
            res.redirect('/login');
            return;
        }
        User.findOne({ email: token.email }, function(err, user) {
            if(user) {
                req.session.user_id = user.id;
                req.currentUser = user;

                token.token = token.randomToken();
                token.save(function() {
                    res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' })
                    next();
                });
            }else {
                res.redirect('/login');
            }
        })
    })
}