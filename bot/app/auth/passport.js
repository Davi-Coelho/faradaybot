const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const LocalStrategy = require('passport-local').Strategy
const axios = require('axios')
const { UserModel } = require('../../config/dbConnection')
const UserDAO = require('../models/UsuarioDAO')()
const { AdminModel } = require('../../config/dbConnection')
const AdminDAO = require('../models/AdminDAO')()
const bcrypt = require('bcrypt')

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_SECRET = process.env.TWITCH_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

module.exports = (passport) => {

    OAuth2Strategy.prototype.userProfile = async function (accessToken, done) {

        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Authorization': 'Bearer ' + accessToken
            }
        })

        if (response && response.status === 200) {
            done(null, response.data)
        } else {
            done(response.data)
        }
    }

    passport.serializeUser(function (user, done) {
        done(null, user)
    })

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('twitch', new OAuth2Strategy({
        authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
        tokenURL: 'https://id.twitch.tv/oauth2/token',
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_SECRET,
        callbackURL: CALLBACK_URL,
        state: true
    },
        async function (accessToken, refreshToken, profile, done) {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            profile.userType = 'normal-user'

            const userParams = {
                _id: profile.data[0].id,
                displayName: profile.data[0].display_name,
                imageUrl: profile.data[0].profile_image_url,
                accessToken: accessToken,
                refreshToken: refreshToken,
                chatJoined: false
            }

            const UsuarioDAO = new UserDAO(UserModel)

            await UsuarioDAO.createOrUpdateUser(userParams)

            return done(null, profile);
        }
    ));

    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        async function (username, password, done) {

            const AdminUserDAO = new AdminDAO(AdminModel)

            const adminUser = await AdminUserDAO.getAdminUser(username)

            if (adminUser) {

                const isValid = bcrypt.compareSync(password, adminUser.password)

                if (!isValid) {
                    return done(null, false)
                }

                const profile = {
                    username: adminUser.username,
                    password: adminUser.password,
                    userType: 'admin-user'
                }

                return done(null, profile)
            } else {
                return done(null, false)
            }
        }
    ))
}