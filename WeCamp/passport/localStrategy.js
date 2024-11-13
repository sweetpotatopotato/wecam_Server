const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Students = require('../models/students');
const Teachers = require('../models/teachers');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback: false,
    }, async (id, password, done) => {
        try {
            // 학생 데이터베이스에서 사용자 검색
            let user = await Students.findOne({ where: { s_id: id } });

            // 학생이 없으면 선생님 데이터베이스에서 검색
            if (!user) {
                user = await Teachers.findOne({ where: { t_id: id } });
            }

            // 사용자가 존재하는지 확인
            if (user) {
                const passwordField = user.s_pass ? user.s_pass : user.t_pass;
                if (password === passwordField) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                return done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));
};
