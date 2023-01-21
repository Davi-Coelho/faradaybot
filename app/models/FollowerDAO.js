class FollowerDAO {
    constructor(FollowerModel) {
        this._FollowerModel = FollowerModel
    }

    createFollow = async (user) => {
        const followerCreated = await this._FollowerModel.create({
            _id: user.id,
            channel: user.login,
            followers: []
        })
        console.log(`followerCreated: ${followerCreated}`)
    }

    getFollower = async (user, follow) => {
        return await this._FollowerModel.findOne({
            _id: user.id,
            'followers._id': follow.user_id
        })
    }

    insertFollow = async (user, follow) => {
        const followerUpdated = await this._FollowerModel.updateOne(
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
        )
        console.log(`followerCreated: ${followerUpdated}`)
    }

    updateFollow = async (user, follow) => {
        const followerUpdated = await this._FollowerModel.updateOne(
            {
                _id: user.id,
                'followers._id': follow.user_id
            },
            {
                $set: {
                    'followers.$.followedAt': follow.followed_at
                }
            }
        )
        console.log(`followerUpdated: ${followerUpdated}`)
    }
}

module.exports = () => {
    return FollowerDAO
}