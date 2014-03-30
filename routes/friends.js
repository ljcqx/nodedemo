/**
 * Created by gongchen on 14-3-29.
 */

var User = require('../models').User,
    Friends = require('../models').Friends;

exports.search = function (req, res) {
    res.render('friends/search');
};

exports.findbyname = function(req, res) {
    var name = req.body.name;
    console.log(name);
    User.find({username:name}, function(err, user) {
        console.log(user);
        res.json(user);
    })
};

exports.add = function(req, res) {
    var friendObj = { userid: req.body.user_id, username: req.body.name};
//    var friendObj1 = { userid: '53354eccae942fff58e44c9f', username: 'aaaa'};
    if(req.session.user_id) {
        Friends.findOne({_id: req.session.user_id}, function(err, friends) {

            if(!friends) {
                console.log('没有数据');
                friends = new Friends({_id: req.session.user_id, friend: [friendObj]});
                friends.save(function(err){
                    if(err) console.log(err);
                    console.log('Success')
                });
            }else{
//              var friends = new Friends({friend:[friendObj]});
                var  find = true;
                for(var i=0; i<friends.friend.length; i++) {
                    if(friends.friend[i].userid == req.body.user_id){
                     find = false;
                        break;
                    }
                }
                console.log(req.body.user_id);

                console.log(friends);

                if(find){
                    friends.friend.push(friendObj);
                    console.log(friends);
                    friends.toObject();
                    friends.save(function (err){
                        if(err) console.log(err);
                        console.log('Success')
                    });
                }else{
                    console.log('已加为好友');
                }

                 //friends = new Friends();
                /*friends.update({ id: req.session.user_id}, {$push: {friend: friendObj}}, {upsert: true}, function(err) {
                    if(err) console.log(err);
                    console.log('update');
                })*/

            }

        });
    }
};

exports.list = function(req, res) {
    Friends.find({_id: req.session.user_id}, function(err, friends) {
        console.log(friends);
        for(var i=0; i<friends.friend.length; i++) {
            res.json()
        }
    });
}

