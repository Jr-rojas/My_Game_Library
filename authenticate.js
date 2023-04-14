const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

function auth(req, res, next) {
    console.log(req.user);

    if (!req.user) {
        const err = new Error('You are not authenticated!');                    
        err.status = 401;
        return next(err);
    } else {
        return next();
    }
}

module.exports = auth

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
