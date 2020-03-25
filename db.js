const Sequelize = require('sequelize');

const UserModel = require('./models/user')
const CameraModel = require('./models/camera')

const sequelize = new Sequelize(process.env.DATABASE_MYSQL);

const User = UserModel(sequelize, Sequelize)
const Camera = CameraModel(sequelize, Sequelize);

module.exports = {
    User,
    Camera
}