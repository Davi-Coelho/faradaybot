const tmi = require('tmi.js')
const db = require('./dbConnection')

const options = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.BOT_PASSWORD
    },
    channels: []
}

const client = new tmi.client(options)

client.on('connected', onConnectedHandler)
client.on('message', onMessageHandler)
client.connect()

function onMessageHandler(target, context, msg, self) {
    if (self) return

    const command = msg

    if (msg === 'Olá') {
        client.say(target, `Olá ${context.username}!`)
    }
}

async function onConnectedHandler(address, port) {
    const channels = await db.ChatbotModel.find({})
    
    channels.forEach(channel => {
        client.join(channel.channel)
    })
    console.log(`* Conectado em ${address}:${port}`)
}

module.exports = { client, db }