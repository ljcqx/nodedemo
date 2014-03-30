
/*
 * GET users listing.
 */
var User = require('../models').User;

exports.login = function(req, res) {
    req.session._loginReferer = req.headers.referer;
    if(req.session.user_id) {
        res.redirect('/');
    }else{
        res.render('user/login', { title: 'Signin'});
    }
};

exports.dologin = function(req, res) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;

    User.findOne({email: email}, function(err, user) {
        console.log(user);
        if(err) { res.send(err) }
        if(user && user.validatePassword(password)) {
            req.session.user_id = user._id; // == user.id
            req.session.username = user.username;

            if(req.body.checkboxes){
                var loginToken = new LoginToken({ email: user.email });
                loginToken.save(function() {
                    res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
                    res.redirect('/');
                });
            }else{
                res.redirect('/');
            }
        }else{
            //req.flash('error', 'Incorrect credentials');
            res.send('email or password error');
            res.redirect('/login');
        }
    });

};

exports.register = function(req, res) {
    if(req.session.user_id) {
        res.redirect('/');
    }else{
        res.render('user/register', { title: 'Signup'});
    }
};

exports.doregister = function(req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    function userSaveFailed() {
        //req.flash('error', 'Account creation failed');
        console.log('Account creation failed');
        res.redirect('/register', { locals: { user: user}})
    }
    user.save(function(err) {
        if(err)  return userSaveFailed();
        // attempt to authenticate user
        //req.flash('info', 'Your account has been created');
        // 发送激活邮件通知 send email
        switch (req.params.format) {
            case 'json':
                res.send(user.toObject); //.toJSON
            break;
            default :
                req.session.user_id = user.id;
                req.session.username = user.username;
                res.redirect('/');
        }
    });
    //res.redirect('/login');
};

exports.logout = function(req, res) {
    if(req.session) {
        //LoginToken.remove({ email: req.currentUser.email }, function() {});
        res.clearCookie('logintoken');
        req.session.destroy(function() {});
    }
//    delete req.session.user_id;
//    delete req.session.username;
    res.redirect('/');
};

exports.list = function(req, res) {
    User.find(function(err, user) {
        res.json(user);
    })
};

//checkUser/checkAuth function