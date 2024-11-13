const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { s_signup, t_signup, signin, signout } = require('../controllers/auth');
const {
    renderProfile,
    renderPasswordChange,
    renderOnboarding,
} = require('../controllers/page');

const router = express.Router();

router.post('/auth/s_signup', isNotLoggedIn, s_signup);

router.post('/auth/t_signup', isNotLoggedIn, t_signup);

router.post('/auth/signin', isNotLoggedIn, signin);

router.post('/auth/signout', isLoggedIn, signout);


router.get('/profile', isLoggedIn, renderProfile);

router.put('/profile/passwordchange', isLoggedIn, renderPasswordChange) // 닉네임 변경으로 교체

router.get('/onboarding', isNotLoggedIn, renderOnboarding);

module.exports = router;