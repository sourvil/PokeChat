var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');

//initialize mongoose schemas
require('./models/models');


//var routes = require('./routes/index');
//var users = require('./routes/users');
var chat = require('./routes/chat');
var auth = require('./routes/auth')(passport);

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/pokechat');     //control
var mongoURI = "mongodb://localhost:27017/pokechat";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function (err) { console.log(err.message); });
MongoDB.once('open', function () {
    console.log("mongodb connection open");
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({ secret: 'nehir' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);


app.use('/chat', chat);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000);

var usernames = [];
var socketUserArray = [];

io.on('connection', function (socket) {

    //console.log('server:connect: ' + socket.id);
    var username;

    socket.on('disconnect', function () {        
        var disconnectedUsername = removeFromArray(socket.id);        
        console.log('server:disconnect:' + disconnectedUsername);
    });

    socket.on('login', function (data) {
        console.log("server:login: " + data + ' socket.id: ' + socket.id);

        username = data;

        if (usernames.indexOf(data) < 0) {
            usernames.push(data);
            io.sockets.emit('usernamesToClient', usernames);

            var socketUser = { 'socketId': socket.id, 'username': username };
            socketUserArray.push(socketUser);
        }
        io.sockets.emit('login', data);
    });

    socket.on('usernamesFromServer', function (data) {
        //console.log('server:usernames: ' + usernames + " from: " + socket.id);
        io.sockets.emit('usernamesToClient', usernames);
    });

    socket.on('messageToServer', function (data) {
        //console.log('server:message: ' + data.message + ' from: ' + data.createdBy + ' at: ' + data.createdAt);
        io.sockets.emit('messageToClient', data);
    });

});

function removeFromArray(value) {
    var disconnectedUsername = "";
    for (var i = 0; i < socketUserArray.length; i++)
    {
        if (socketUserArray[i].socketId == value) {            
            for (var j = 0; j < usernames.length; j++) {
                if (usernames[j] == socketUserArray[i].username)
                    usernames.splice(j, 1);
            }
            disconnectedUsername = socketUserArray[i].username;
            socketUserArray.splice(i, 1);
            break;
        }
    }
    return disconnectedUsername;
}

module.exports = app;
