const Sequelize = require('sequelize');

const UserModel = require('./models/user')
const CameraModel = require('./models/camera')

const sequelize = new Sequelize('mysql://b0582d22f049d0:adbca5c4@eu-cdbr-west-02.cleardb.net/heroku_3ca53332a861b27');

const User = UserModel(sequelize, Sequelize)
const Camera = CameraModel(sequelize, Sequelize);

module.exports = {
    User,
    Camera
}