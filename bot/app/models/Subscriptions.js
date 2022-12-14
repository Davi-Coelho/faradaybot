const axios = require('axios')

class Subscriptions {

    constructor(SubscriptionModel) {
        this._SubscriptionModel = SubscriptionModel
        this._CLIENT_ID = process.env.TWITCH_CLIENT_ID
        this._APP_ACCESS_TOKEN = process.env.APP_ACCESS_TOKEN
        this._SECRET = process.env.SUBSCRIPTION_SECRET
        this._WEBHOOK_CALLBACK = process.env.CALLBACK_WEBHOOK
    }

    createSubscription = (subscriptions, user) => {
        subscriptions.forEach((type, i) => {
            const params = {
                'type': type,
                'version': '1',
                'condition': {
                    'broadcaster_user_id': user.id
                },
                'transport': {
                    'method': 'webhook',
                    'callback': this._WEBHOOK_CALLBACK,
                    'secret': this._SECRET
                }
            }
            if (type === 'channel.raid') {
                params['condition']['to_broadcaster_user_id'] = user.id
                delete params['condition']['broadcaster_user_id']
            }
            this._SubscriptionModel.findOne({ userId: user.id, subscriptionType: type }).then(result => {
                if (result === null) {
                    axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', params, {
                        headers: {
                            'Client-ID': this._CLIENT_ID,
                            'Authorization': `Bearer ${this._APP_ACCESS_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        this._SubscriptionModel.create({
                            userId: user.id,
                            subscriptionId: response.data.data[0].id,
                            subscriptionType: response.data.data[0].type
                        }).then(result => console.log('resultCreate: ', result))
                            .catch(err => console.log('errCreate', err))
                    }).catch(err => console.log('errAxiosPost: ', err))
                }
                else {
                    console.log(`Subscription ${type} já cadastrada!`)
                }
            })
        })
    }

    revokeSubscription = (subscription, user) => {
        this._SubscriptionModel.findOne({ userId: user.id, subscriptionType: subscription.type }).then(result => {
            if (result === null) {
                console.log('Not found!')
            }
            else {
                axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${result.subscriptionId}`, {
                    headers: {
                        'Client-ID': this._CLIENT_ID,
                        'Authorization': `Bearer ${this._APP_ACCESS_TOKEN}`
                    }
                }).then(response => {
                    this._SubscriptionModel.deleteOne({
                        userId: user.id,
                        subscriptionType: subscription.type
                    }).then(response => console.log(response))
                }).catch(err => console.log('errAxiosDelete: ', err))
            }
        })
    }

    getSubscriptions = (user, callback) => {
        this._SubscriptionModel.find({ userId: user.id }).then(result => {
            callback(result)
        })
    }

}

module.exports = () => {
    return Subscriptions
}