class AdminDAO {
    constructor(AdminModel) {
        this._AdminModel = AdminModel
    }

    getAdminUser = async (username) => {
        return await this._AdminModel.findOne({ username: username })
    }
}

module.exports = () => {
    return AdminDAO
}