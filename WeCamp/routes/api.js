const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn, isTeacher, isStudent } = require('../middlewares');
const { s_signup, t_signup, signin, checkLoginStatus, signout } = require('../controllers/auth');
const {
    renderProfile,
    renderPasswordChange,
    renderStudentsMain,
    renderTeachersMain,
    renderOnboarding,
    createLesson,
    readLessons,
    readLessonsData,
    readLesson,
    readLessonData,
    updateLesson,
    createPerformance,
    readPerformances,
    WebreadPerformances,
    readPerformancesData,
    readPerformance,
    updatePerformance,
    createEvaluation,
    readAllEvaluationsForTeacher,
    readAllEvaluationsForStudent,
    updateEvaluationScore,
    updateEvaluationCheck,
} = require('../controllers/page');

const router = express.Router();

router.post('/auth/s_signup', isNotLoggedIn, s_signup);

router.post('/auth/t_signup', isNotLoggedIn, t_signup);

router.post('/auth/signin', isNotLoggedIn, signin);

router.post('/auth/signout', isLoggedIn, signout);


router.get('/profile', isLoggedIn, renderProfile);

router.put('/profile/passwordchange', isLoggedIn, renderPasswordChange) // 닉네임 변경으로 교체

router.get('/onboarding', isNotLoggedIn, renderOnboarding);

router.post('/lesson/create', isLoggedIn, isTeacher, createLesson);

router.get('/lesson/teacher=:teacher', isLoggedIn, readLessons);

router.get('/lesson/classof', isLoggedIn, readLessonsData);

router.get('/lesson/teacher=:teacher/:id', isLoggedIn, isTeacher, readLesson);

router.get('/lesson/classof/:id', isLoggedIn, readLessonData)

router.put('/lesson/teacher=:teacher/update/:id', isLoggedIn, isTeacher, updateLesson);

// Main
router.get('/students', renderStudentsMain);

router.get('/teachers', renderTeachersMain);

module.exports = router;