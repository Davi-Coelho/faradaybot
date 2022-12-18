module.exports.index = (application, req, res) => {
    let botName = process.env.BOT_NAME
    botName = botName.charAt(0).toUpperCase() + botName.slice(1)
    
    if (req.isAuthenticated() && req.session.passport.user.userType === 'normal-user') {
        res.redirect('/dashboard')
    }
    else {
        res.render('index', { botName })
    }
}

module.exports.subscription = async (application, req, res) => {

    const user = req.session.passport.user.data[0]
    const Subscriptions = new application.app.models.Subscriptions(application.db.SubscriptionModel)
    const UsuarioDAO = new application.app.models.UsuarioDAO(application.db.UserModel)
    const FollowerDAO = new application.app.models.FollowerDAO(application.db.FollowerModel)
    const subTypes = ['channel.follow', 'channel.subscribe', 'channel.cheer', 'channel.raid']

    const userData = await UsuarioDAO.getUser(user)
    console.log(userData)

    if (userData === null) {
        await FollowerDAO.createFollow(user)
        await Subscriptions.createSubscription(subTypes, user)
    }

    res.redirect('/dashboard')
}

module.exports.subscriptionCallback = async (application, req, res) => {

    switch (req.headers['twitch-eventsub-message-type']) {
        case 'webhook_callback_verification':
            console.log('verification: ', req.body.subscription.type)
            res.send(req.body.challenge)
            break
        case 'notification':
            console.log('notification: ')
            console.log(req.body.event)
            const subscriptionType = req.body.subscription.type
            const event = req.body.event
            const userEvent = subscriptionType !== 'channel.raid' ? event.user_name : event.from_broadcaster_user_name
            const user = {
                id: event.broadcaster_user_id,
                login: event.broadcaster_user_login,
                display_name: event.broadcaster_user_name
            }
            const channel = "#" + user.login
            const index = application.bot.channels.indexOf(channel)

            switch (subscriptionType) {
                case 'channel.follow':
                    const FollowerDAO = new application.app.models.FollowerDAO(application.db.FollowerModel)
                    const userData = await FollowerDAO.getFollower(user, event)
                        
                    if (userData === null) {
                        await FollowerDAO.insertFollow(user, event)
                        application.bot.say(application.bot.channels[index], `Obrigado pelo follow ${userEvent}!`)
                    } else {
                        const indexFollower = userData.followers.findIndex(follower => follower._id === parseInt(event.user_id))

                        if (userData.followers[indexFollower].followedAt !== event.followed_at) {
                            await FollowerDAO.updateFollow(user, event)
                        }
                        else {
                            console.log('Follow repetido!')
                        }
                    }
                    break
                case 'channel.subscribe':
                    application.bot.say(application.bot.channels[index], `Muito obrigado pelo sub ${userEvent}!`)
                    break
                case 'channel.cheer':
                    const bits = event.bits
                    application.bot.say(application.bot.channels[index], `Obrigado pelos ${bits} bits ${userEvent}`)
                    break
                case 'channel.raid':
                    const viewers = event.viewers
                    application.bot.say(application.bot.channels[index], `Muito obrigado pela raid de ${viewers} viewers, ${userEvent}! Sejam bem vindos!`)
                    break
            }
            res.sendStatus(200)
            break
        default:
            console.log('outro: ', req.headers['twitch-eventsub-message-type'])
            console.log(req.body)
            res.sendStatus(200)
    }
}
