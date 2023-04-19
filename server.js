if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const authenticate = require('./authenticate')
const flash = require('connect-flash')

const indexRouter = require('./routes/index')
const developerRouter = require('./routes/developers')
const gameRouter = require('./routes/games')
const userRouter = require('./routes/users')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(session({
    name: 'session-id',
    secret:'12345-67890-09876-54321',
    saveUnitialized: false,
    ressave: false,
    store: new FileStore()
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//app.use(auth)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user; // this line is just an example of setting a different variable
    res.locals.currentPage = req.path; // this line sets currentPage to the current path
    next();
});

const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/developers', developerRouter)
app.use('/games', gameRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3001)