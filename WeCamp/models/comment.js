// models/comment.js
const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static initiate(sequelize) {
        Comment.init({
            c_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            c_content: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            p_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            s_id: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
            t_id: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Comment.belongsTo(db.Post, { foreignKey: 'p_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        db.Comment.belongsTo(db.Students, { foreignKey: 's_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        db.Comment.belongsTo(db.Teachers, { foreignKey: 's_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}

module.exports = Comment;
