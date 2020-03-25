module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        telegram_id: type.STRING,
        first_name: type.STRING,
        last_name: type.STRING,
        username: type.STRING,
        language_code: type.STRING,
        is_bot: type.BOOLEAN
    })
}