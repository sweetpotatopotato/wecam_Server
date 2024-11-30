require('dotenv').config();

module.exports = {
    development: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "wecam",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    test: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "wecam_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "wecam",
        host: "127.0.0.1",
        dialect: "mysql",
        logger: false
    },
};
