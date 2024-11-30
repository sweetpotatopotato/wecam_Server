// models/post.js
const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            p_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            p_title: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            p_content: {
                type: Sequelize.STRING(140),
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
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.Students, {
            foreignKey: 's_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        db.Post.belongsTo(db.Teachers, {
            foreignKey: 's_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        db.Post.hasMany(db.Comment, { foreignKey: 'p_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}

module.exports = Post;
