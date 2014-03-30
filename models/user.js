/**
 * Created by gongchen on 14-3-13.
 */
var mongoose = require('mongoose'),
    hashSalt = require('../lib/hashsalt'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true}, //index: true
    email: {type: String, required: true, unique: true},
    mobile: {type: Number},
    password: {type: String, required: true},
    salt: {type: String},
    realname: {type: String},
    gender: String,
    profile: {type: String},
    avatar: {type: String},
    album: [],
    status: Number,
    actived: {type: Boolean, default: false},
    login_time: {type: Date},
    create_time: {type: Date, default: Date.now}
});

/*UserSchema.virtual('password').get(function(password) {
    this._password = password;
    this.salt = hashSalt.generateSalt(10);
    this.hashpassword = this.encryptPassword(password);
}).get(function() {
    return this._password;
});*/



/*UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if(!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});*/

UserSchema.pre('save', function(next) {
    if(this.isNew){
        this.salt = hashSalt.hashSalt();
        this.password = this.encryptPassword(this.password);
        this.create_time = Date.now();
    }
    next();
});

UserSchema.methods.hasPassword = function(password, salt) {
    return hashSalt.md5(hashSalt.md5(password) + salt);
};

UserSchema.methods.validatePassword = function(password) {
    return this.hasPassword(password, this.salt) === this.password;
};

UserSchema.methods.encryptPassword = function(password) {
    return hashSalt.md5(hashSalt.md5(password) + this.salt);
};

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.getUsersByNames = function(names, callback) {
    if(names.length === 0) {
        return callback(null, []);
    }
    userModel.find({ name: {$in: names }}, callback);
};

UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

var userModel = mongoose.model('User', UserSchema);


