class FollowerDAO {
    constructor(FollowerModel) {
        this._FollowerModel = FollowerModel
    }

    createFollow = (user) => {
        this._FollowerModel.create({
            _id: user.id,
            channel: user.login,
            followers: []
        }).then(result => console.log('createFollowResult: ', result))
        .catch(err => console.log('createFollowErr: ', err))
    }

    getFollower = (user, follow, callback) => {
        this._FollowerModel.findOne({
            _id: user.id,
            'followers._id': follow.user_id
        }).then(result => {
            callback(result)
        })
        .catch(err => console.log('getFollowerErr: ', err))
    }

    insertFollow = (user, follow) => {
        this._FollowerModel.updateOne(
            {
                _id: user.id
            },
            {
                $push: {
                    followers: {
                        _id: follow.user_id,
                        followerLogin: follow.user_login,
                        followerUserName: follow.user_name,
                        followedAt: follow.followed_at
                    }
                }
            }
            ).then(result => console.log('insertFollowResult: ', result))
            .catch(err => console.log('insertFollowErr: ', err))
    }

    updateFollow = (user, follow) => {        
        this._FollowerModel.updateOne(
            {
                _id: user.id,
                'followers._id': follow.user_id
            },
            {
                $set: {
                    'followers.$.followedAt': follow.followed_at
                }
            }
        ).then(result => console.log('updateFollowResult: ', result))
        .catch(err => console.log('updateFollowErr: ', err))
    }
}

module.exports = () => {
    return FollowerDAO
}