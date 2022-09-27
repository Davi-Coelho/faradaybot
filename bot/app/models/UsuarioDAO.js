const axios = require('axios')

class UsuarioDAO {
    constructor(UserModel) {
        this._UserModel = UserModel
    }

    createOrUpdateUser = (user) => {
        this._UserModel.findOne({ _id: user._id })
            .then(result => {
                if (result === null) {
                    this._UserModel.create(user)
                }
                else {
                    const params = new URLSearchParams()
                    params.append('client_id', process.env.TWITCH_CLIENT_ID)
                    params.append('token', result.refreshToken)
                    axios.post('https://id.twitch.tv/oauth2/revoke', params, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(response => {
                        this._UserModel.updateOne(
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
                        ).then(result => console.log('resultUpdateOne: ', result))
                    }).catch(err => console.log('errAxiosPost: ', err))
                }
            })
            .catch(err => console.log('errFindOne: ', err))
    }

    getUser = (user, callback) => {
        this._UserModel.findOne({ _id: user.id })
            .then(result => {
                callback(result)
            })
    }

    getAllUsers = async () => {
        return await this._UserModel.find()
    }

    updateUserChat = (user, chatJoined) => {
        this._UserModel.updateOne(
            {
                _id: user.id
            },
            {
                $set: {
                    chatJoined: chatJoined
                }
            }
        ).then(result => console.log('resultUpdateChat: ', result))
    }
}

module.exports = () => {
    return UsuarioDAO
}