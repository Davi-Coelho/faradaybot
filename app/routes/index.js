module.exports = (application) => {
    application.get('/', (req, res) => {
        application.app.controllers.index.index(application, req, res)
    })

    application.get('/auth/twitch', application.passport.authenticate('twitch', { scope: 'user:read:email bits:read channel:read:subscriptions' }))

    application.get('/auth/twitch/callback', application.passport.authenticate('twitch', { failureRedirect: '/' }), (req, res) => {
        application.app.controllers.index.subscription(application, req, res)
    })

    application.post('/webhooks/callback', (req, res) => {
        application.app.controllers.index.subscriptionCallback(application, req, res)
    })

}