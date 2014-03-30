
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    redis = require('redis'),
    config = require('./config'),
    RedisStore = require('connect-redis')(express);
    //express.session.Store

var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

var redis_options = {
    client: redis.createClient()
};

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser({ keepExtensions: true, uploadDir: './tmp' }));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ store: new RedisStore(redis_options), key: 'session_id', secret: 'keyboard cat' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'public', config.upload_dir)));
app.use('/user_data', express.static(path.join(__dirname, 'public', 'user_data')));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if(err) res.locals.message = '<div class="msg error"> + err + </div> ';//<p>
    if(msg) res.locals.message = '<div class="msg success"> + msg + </div> ';
    next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('*', function(req, res, next) {
    //res.send(404);
    //console.log(req.session);
    next();
});

io.sockets.on('connection', function(socket) {
    console.log('client Connected');
    socket.on('message', function(data) {
        socket.emit(data);
    });

    socket.on('disconnect', function() {
        console.log('client Disconnected.')
    })
});
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
