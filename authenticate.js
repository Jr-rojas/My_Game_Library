const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

function auth(req, res, next) {
    //console.log(req.user);
    if (!req.user) {
        const error = 'You are not authenticated!'
        res.locals.error = error
        return next()
    } else {
        const error = null
        res.locals.error = error
        return next()
    }
}

module.exports = auth

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
