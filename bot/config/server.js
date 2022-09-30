const express = require('express')
const session = require('express-session')
const passport = require('passport')
const consign = require('consign')
const cookieParser = require('cookie-parser')
const { client, db } = require('./chatbot')
const i18n = require('./i18n.config')

const SESSION_SECRET = process.env.SESSION_SECRET

const app = express()

app.set('view engine', 'ejs')
app.set('views', './app/views')

require('../app/auth/passport')(passport)
app.use(cookieParser())
app.use(express.static('./app/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 60 * 1000}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(i18n.init)
app.passport = passport
app.db = db
app.bot = client

consign()
    .include('app/controllers')
    .then('app/models')
    .then('app/routes')
    .into(app)

module.exports = app