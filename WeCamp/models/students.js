const Sequelize = require('sequelize');

class Students extends Sequelize.Model {
    static initiate(sequelize) {
        Students.init({
            s_id: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            s_pass: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            s_name: {
                type: Sequelize.STRING(12),
                allowNull: false,
            },
            s_nicname: {
                type: Sequelize.STRING(25),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Students',
            tableName: 'students',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associations(db) {
        db.User.hasMany(db.Post);
    }    
};

module.exports = Students;