/**
 * Created by gongchen on 14-3-30.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userfriend = {
    userid: ObjectId,
    username: String
};

var subfriend = new Schema({
    userid: ObjectId,
    username: String
},{ _id : false });

var friendSchema = new Schema({
    uid: ObjectId,
    friend: [subfriend]
});

mongoose.model('Friends', friendSchema);

friendSchema.pre('save', function(next) {
    if(this.isNew){
        //this.id = req.session.user_id;
    }
    next();
});

friendSchema.methods.findByname = function(name) {
    //
};

//var name = 'Peter';
/*
model.findOne({name: new RegExp('^'+name+'$', "i")}, function(err, doc) {
    //Do your action here..
});*/
