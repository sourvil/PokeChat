var localStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var users = {};

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);
        return done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {

        return done(null, users[username]);

    });

    passport.use('login', new localStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {

            if (!users[username]) {
                console.log(username + ' is wrong username!');
            }

            if (!isValidPassword(password, users[username].password)) {
                console.log('Wrong password');
            }

            return done(null, users[username]);
        }
    ));

    passport.use('signup', new localStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            if (users[username]) {
                console.log(username + ' already exists!');
            }

            stores[username] = {
                username: username,
                password: createHash(password)
            };

            console.log(username + 'is signed up');
            return done(null, users[username]);

        })
    );

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};