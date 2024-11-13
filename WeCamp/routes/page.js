const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
    renderProfile,
    renderOnboarding,
    createLesson,
    readLessons,
    readLesson,
    updateLesson,
} = require('../controllers/page');

const router = express.Router();

router.get('/profile', isLoggedIn, renderProfile);

router.get('/onboarding', isNotLoggedIn, renderOnboarding);

// Lesson
router.post('/lesson/create', /* isLoggedIn, isTeachers */ createLesson);

router.get('/lesson/read', /* isLoggedIn, */ readLessons);

router.get('/lesson/read/:id', /* isLoggedIn, */ readLesson);

router.put('/lesson/update/:id', /* isLoggedIn, isTeachers */ updateLesson);

// // Main
// router.get('/students', renderStudentsMain);

// router.get('/teachers', renderTeachersMain);

module.exports = router;
