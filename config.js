/**
 * Created by gongchen on 14-3-10.
 */
var path = require('path');

module.exports = {
    "name": 'Node Demo',
    "debug": true,
    "description": '',
    "site_logo": '',
    "upload_dir": path.join(__dirname, 'public', 'user_data', 'images'),
    "mongodb": 'mongodb://localhost/node_demo',
    /*"mongodb": {
     "host": 'localhost',
     "port": '27017',
     "user": '',
     "password": '',
     "database": 'node_demo'
     },*/
    "redis": {
        "host": 'localhost',
        "port": '6379',
        "secret": '',
        "prefix": 'session:'
    },
    "redis_url": '',
    "session_secret": 'node_demo',
    "auth_cookie_name": 'node_demo',
    "mysql": {
        "host": "127.0.0.1",
        "user": "root",
        "pass": "123456",
        "port": "3306",
        "dbname": "nodetest",
        "charset": "utf8"
    },
    "port": "3000",
    "email": {
        "service": 'Gmail',
        "user": 'ljc6qx@gmail.com',
        "pass": 'feng___123'
    }
};
