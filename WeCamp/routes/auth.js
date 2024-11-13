const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { s_signup, t_signup, signin, signout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/s_signup (학생 가입)
router.post('/s_signup', isNotLoggedIn, s_signup);

// POST /auth/t_signup (교사 가입)
router.post('/t_signup', isNotLoggedIn, t_signup);

// POST /auth/signin (로그인)
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: '서버 오류' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: '로그인 실패' });
            }
            return res.json({ id: user.id, role: user.role });
        });
    })(req, res, next);
});

// POST /auth/signout (로그아웃)
router.post('/signout', isLoggedIn, signout);

module.exports = router;
