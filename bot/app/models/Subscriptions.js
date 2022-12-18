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
        subscriptions.forEach(async (type) => {
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

            const subscription = await this._SubscriptionModel.findOne({ userId: user.id, subscriptionType: type })

            if (subscription === null) {
                const postResponse = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', params, {
                    headers: {
                        'Client-ID': this._CLIENT_ID,
                        'Authorization': `Bearer ${this._APP_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                })
                console.log(`postResponse: ${postResponse}`)
                const subscriptionCreated = await this._SubscriptionModel.create({
                    userId: user.id,
                    subscriptionId: postResponse.data.data[0].id,
                    subscriptionType: postResponse.data.data[0].type
                })
                console.log(`subscriptionCreated: ${subscriptionCreated}`)
            } else {
                console.log(`Subscription ${type} já cadastrada!`)
            }
        })
    }

    revokeSubscription = async (subscription, user) => {
        const subscriptionData = await this._SubscriptionModel.findOne({ userId: user.id, subscriptionType: subscription.type })

        if (subscriptionData === null) {
            console.log('Not found!')
        } else {
            const deleteResponse = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionData.subscriptionId}`, {
                headers: {
                    'Client-ID': this._CLIENT_ID,
                    'Authorization': `Bearer ${this._APP_ACCESS_TOKEN}`
                }
            })
            console.log(`deleteResponse: ${deleteResponse}`)
            const subscriptionDeleted = await this._SubscriptionModel.deleteOne({
                userId: user.id,
                subscriptionType: subscription.type
            })
            console.log(`subscriptionDeleted: ${subscriptionDeleted}`)
        }
    }

    getSubscriptions = async (user) => {
        return await this._SubscriptionModel.find({ userId: user.id })
    }

}

module.exports = () => {
    return Subscriptions
}