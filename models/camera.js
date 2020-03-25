module.exports = (sequelize, type) => {
    return sequelize.define('camera', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        url_image: type.STRING,
        address: type.STRING
    })
}