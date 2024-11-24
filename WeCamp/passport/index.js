const passport = require('passport');
const local = require('./localStrategy');
const Students = require('../models/students');
const Teachers = require('../models/teachers');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // ID만 저장
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await Students.findOne({ where: { s_id: id } });
            if (!user) {
                user = await Teachers.findOne({ where: { t_id: id } });
            }
            if (!user) {
                return done(new Error('User not found'));
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    local(); // 로컬 전략 초기화
};
