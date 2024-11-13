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
            p_img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
  
    static associate(db) {
        db.Post.hasMany(db.Students);
        db.Post.hasMany(db.Teachers);
        db.User.hasMany(db.Comment);
    }
}

module.exports = Post;