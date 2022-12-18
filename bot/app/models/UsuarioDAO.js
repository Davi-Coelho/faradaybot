const axios = require('axios')

class UsuarioDAO {
    constructor(UserModel) {
        this._UserModel = UserModel
    }

    createOrUpdateUser = async (user) => {
        const userData = await this._UserModel.findOne({ _id: user._id })
        if (userData === null) {
            const userCreated = await this._UserModel.create(user)
            console.log(`userCreated: ${userCreated}`)
        } else {
            const params = new URLSearchParams()
            params.append('client_id', process.env.TWITCH_CLIENT_ID)
            params.append('token', userData.refreshToken)
            const postResponse = await axios.post('https://id.twitch.tv/oauth2/revoke', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            console.log(`postResponse: ${postResponse}`)

            const userUpdated = await this._UserModel.updateOne(
                {
                    _id: user._id
                },
                {
                    $set: {
                        displayName: user.displayName,
                        imageUrl: user.imageUrl,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken
                    }
                }
            )
            console.log(`userUpdated: ${userUpdated}`)
        }
    }

    getUser = async (user) => {
        return await this._UserModel.findOne({ _id: user.id })
    }

    getAllUsers = async () => {
        return await this._UserModel.find()
    }

    updateUserChat = async (user, chatJoined) => {
        const userChatUpdated = await this._UserModel.updateOne(
            {
                _id: user.id
            },
            {
                $set: {
                    chatJoined: chatJoined
                }
            }
        )
        console.log(`userChatUpdated: ${userChatUpdated}`)
    }
}

module.exports = () => {
    return UsuarioDAO
}