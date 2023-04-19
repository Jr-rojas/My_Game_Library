const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/', (req, res) => {
    const user = req.user

    res.render('users/index', {user: user})
})

//SIGNUP only used to create admin
router.get('/signup', (req, res) => {
    res.render('users/signup',{ user: new User() })
})

router.post('/signup', (req, res) => {
    const { username, password } = req.body
 
    User.register(
        new User ({ username }),
        password,
        (err, user) => {
            if (err) {
                res.render('users/signup',{
                    errorMessage: 'error creating user'
                })
            } else {
                passport.authenticate('local')(req, res, () => {
                    req.session.message = 'User created successfully'
                    res.redirect('/')
                })
            }
        }
    )
})

//SIGNIN
router.get('/signin', (req, res) => {
    res.render('users/signin', {user: new User()})
})

router.post('/signin', passport.authenticate('local'), (req, res) => {
    try{
        req.flash('success', 'You have successfully logged in!');
        res.redirect('/');
    }catch{
        res.redirect('/')
    }
});

//LOGOUT
router.get('/logout', (req, res) => {
    if (req.session){
        req.session.destroy()
        res.clearCookie('session-id')
        res.redirect('/')
    }else{
        res.render('/users',{
            errorMessage: 'error logging out'
        })
    }
});


module.exports = router