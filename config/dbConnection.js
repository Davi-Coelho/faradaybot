const mongoose = require('mongoose')

const {
    DB,
    DB_USER,
    DB_PASS,
    ADMIN_USER,
    ADMIN_PASSWORD
} = process.env

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

async function initDatabase() {
    try {
        await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@mongo:27017/${DB}?authSource=admin`)
        console.log('Conectado ao banco de dados!')
    } catch (err) {
        console.log(`mongoConnectError: ${err}`)
    }

    const adminUser = await AdminModel.findOne({ username: ADMIN_USER })
    if (adminUser === null) {
        const adminCreated = await AdminModel.create({
            username: ADMIN_USER,
            password: ADMIN_PASSWORD
        })
        console.log(`adminCreated: ${adminCreated}`)
    } else {
        console.log('Conta de Administrador já existe!')
    }
}

initDatabase()

module.exports = { UserModel, SubscriptionModel, ChatbotModel, FollowerModel, AdminModel }
