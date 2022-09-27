const mongoose = require('mongoose')
const DB = process.env.DB
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD
const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

mongoose.connect(`mongodb://${DB_USER}:${DB_PWD}@mongo:27017/${DB}?authSource=${DB}`)
    .then(() => console.log('Conectado ao banco de dados!'))
    .catch(() => console.log('Erro ao se conectar com o banco de dados!'))

const UserSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    chatJoined: {
        type: Boolean,
        required: true
    }
})

const SubscriptionSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    subscriptionId: {
        type: String,
        required: true
    },
    subscriptionType: {
        type: String,
        required: true
    }
})

const ChatbotSchema = mongoose.Schema({
    channel: {
        type: String,
        required: true
    }
})

const FollowerSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    followers: [
        {
            _id: {
                type: Number
            },
            followerLogin: {
                type: String
            },
            followerUserName: {
                type: String
            },
            followedAt: {
                type: String
            }
        }
    ]
})

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model('users', UserSchema)
const SubscriptionModel = mongoose.model('subscriptions', SubscriptionSchema)
const ChatbotModel = mongoose.model('chatbots', ChatbotSchema)
const FollowerModel = mongoose.model('followers', FollowerSchema)
const AdminModel = mongoose.model('admins', AdminSchema)

AdminModel.findOne({ username: ADMIN_USER }).then(result => {
    if (result === null) {
        AdminModel.create({
            username: ADMIN_USER,
            password: ADMIN_PASSWORD
        }).then(() => {
            console.log('Conta de Administrador criada!')
        })
    }
    else {
        console.log('Conta de Administrador já existe!')
    }
})

module.exports = { UserModel, SubscriptionModel, ChatbotModel, FollowerModel, AdminModel }