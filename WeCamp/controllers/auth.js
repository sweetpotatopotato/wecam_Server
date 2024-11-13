const passport = require('passport');
const Students = require('../models/students');
const Teachers = require('../models/teachers');
// const { isNotLoggedIn } = require('../middlewares');

exports.s_signup = async (req, res, next) => {
    console.log(req.body)
    const { s_id, s_pass, s_name, s_nicname } = req.body;

    if (/\s/.test(s_id) || /\s/.test(s_pass) || /\s/.test(s_name) || /\s/.test(s_nicname)) {
        return res.status(400).send('공백없이 입력해주세요.');
    }

    try {
        if (s_name.length > 12) {
            return res.status(400).send('이름은 최대 12자입니다.');
        }
        if (s_id.length > 15) {
            return res.status(400).send('아이디는 최대 15자입니다.');
        }
        if (s_nicname.length > 25) {
            return res.status(400).send('닉네임은 최대 25자입니다.');
        }
        const exStudents = await Students.findOne({ where: { s_id } });
        const exTeachers = await Teachers.findOne({ where: { t_id: s_id } });
        const exStudent = await Students.findOne({ where: { s_nicname } });
        const exTeacher = await Teachers.findOne({ where: { t_nicname: s_nicname } });
        if (exStudents || exTeachers) {
            return res.status(400).send('이미 존재하는 아이디입니다.');
        }
        if (exStudent || exTeacher) {
            return res.status(400).send('이미 존재하는 닉네임입니다.');
        }
        await Students.create({
            s_id,
            s_pass,
            s_name,
            s_nicname,
        });
        return res.status(200).send('회원가입 성공');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.t_signup = async (req, res, next) => {
    console.log(req.body)
    const { t_id, t_pass, t_name, t_nicname, t_subject } = req.body;

    if (/\s/.test(t_id) || /\s/.test(t_pass) || /\s/.test(t_name) || /\s/.test(t_nicname)) {
        return res.status(400).send('공백없이 입력해주세요.');
    }

    try {
        if (t_name.length > 12) {
            return res.status(400).send('이름은 최대 12자입니다.');
        }
        if (t_id.length > 10) {
            return res.status(400).send('아이디는 최대 10자입니다.');
        }
        if (t_nicname.length > 25) {
            return res.status(400).send('닉네임은 최대 25자입니다.');
        }
        if (t_subject.length > 15) {
            return res.status(400).send('과목은 최대 15자 입니다.');
        }
        const exTeachers = await Teachers.findOne({ where: { t_id } });
        const exStudents = await Students.findOne({ where: { s_id: t_id } });
        const exTeacher = await Teachers.findOne({ where: t_nicname });
        const exStudent = await Students.findOne({ where: { s_nicname: t_nicname } });
        if (exTeachers || exStudents) {
            return res.status(400).send('이미 존재하는 아이디입니다.');
        }
        if (exTeacher || exStudent) {
            return res.status(400).send('이미 존재하는 닉네임입니다.');
        }
        await Teachers.create({
            t_id,
            t_pass,
            t_name,
            t_nicname,
            t_subject,
        });
        return res.status(200).send('회원가입 성공')
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.signin = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        return req.logIn(user, (signinError) => {
            if (signinError) {
                console.error(signinError);
                return next(signinError);
            }

            req.session.userId = user.s_id ? user.s_id : user.t_id;
            req.session.userRole = user.s_id ? 'student' : 'teacher';

            const userType = req.session.userRole;
            const userId = req.session.userId;

            console.log("세션 정보:", req.session);

            return res.status(200).json({ userType, userId });
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('로그아웃 실패');
            }
            res.status(200).send('로그아웃 성공');
        });
    });
};
