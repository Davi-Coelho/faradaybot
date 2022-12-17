module.exports.dashboard = (application, req, res) => {
    let botName = process.env.BOT_NAME
    botName = botName.charAt(0).toUpperCase() + botName.slice(1)

    if (req.isAuthenticated() && req.session.passport.user.userType === 'normal-user') {
        const user = req.session.passport.user.data[0]
        const UsuarioDAO = new application.app.models.UsuarioDAO(application.db.UserModel)

        UsuarioDAO.getUser(user, result => {
            res.render('dashboard', { usuario: user, chatJoined: result.chatJoined, botName: botName })
        })
    }
    else {
        res.redirect('/')
    }
}

module.exports.logout = (application, req, res) => {
    if (req.isAuthenticated() && req.session.passport.user.userType === 'normal-user') {
        req.session.destroy(_ => {
            res.redirect('/')
        })
    }
}

module.exports.alerts = (application, req, res) => {
    const user = req.session.passport.user.data[0]
    const Subscriptions = new application.app.models.Subscriptions(application.db.SubscriptionModel)

    Subscriptions.getSubscriptions(user, result => {
        const subscriptions = result.map(type => {
            return type.subscriptionType
        })
        console.log(subscriptions)
        res.render('alerts', { subscriptions })
    })
}

module.exports.alertsPost = (application, req, res) => {
    const user = req.session.passport.user.data[0]
    const subscription = req.body
    const Subscriptions = new application.app.models.Subscriptions(application.db.SubscriptionModel)

    if (subscription.active) {
        Subscriptions.createSubscription([subscription.type], user)
        res.status(201).send('created')
    }
    else {
        Subscriptions.revokeSubscription(subscription, user)
        res.status(201).send('revoked')
    }
}