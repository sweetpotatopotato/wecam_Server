const Sequelize = require('sequelize');

class Teachers extends Sequelize.Model {
    static initiate(sequelize) {
        Teachers.init({
            t_id: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            t_pass: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            t_name: {
                type: Sequelize.STRING(12),
                allowNull: false,
            },
            t_nicname: {
                type: Sequelize.STRING(25),
                allowNull: false,
                unique: true,
            },
            t_subject: {
                type: Sequelize.STRING(15),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Teachers',
            tableName: 'teachers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associations(db) {
        db.User.hasMany(db.Post);
    }
}

module.exports = Teachers;