const passport = require('passport');
const local = require('./localStrategy');
const Students = require('../models/students');
const Teachers = require('../models/teachers');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, { id: user.s_id || user.t_id, role: user.s_pass ? 'student' : 'teacher' });
    });

    passport.deserializeUser(async (obj, done) => {
        try {
            let user = null;
            if (obj.role === 'student') {
                user = await Students.findOne({ where: { s_id: obj.id } });
            } else if (obj.role === 'teacher') {
                user = await Teachers.findOne({ where: { t_id: obj.id } });
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    local();
};
