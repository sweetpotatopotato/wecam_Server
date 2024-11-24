const express = require('express');
const passport = require('passport');
const { crawlNotices } = require('../school-crawler/crawler');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { s_signup, t_signup, signin, signout } = require('../controllers/auth');
const {
    renderProfile,
    NicnameChange,
    createPost,
    readPosts,
    readPost,
    updatePost,
    createcomment,
    readComments,
    createComment
} = require('../controllers/page');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Auth"
 *     description: "사용자 인증 관련 API"
 *   - name: "Post"
 *     description: "게시글 관련 API"
 *   - name: "Comment"
 *     description: "댓글 관련 API"
 *   - name: "Profile"
 *     description: "개인정보 관련 API"
 */

/**
 * @swagger
 * /auth/s_signup:
 *   post:
 *     tags: ["Auth"]
 *     summary: "학생 회원가입"
 *     description: "학생이 회원가입을 진행합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               s_name:
 *                 type: string
 *                 description: "학생 이름"
 *                 example: "학생1"
 *               s_id:
 *                 type: string
 *                 description: "학생 ID"
 *                 example: "student1"
 *               s_pass:
 *                 type: string
 *                 description: "학생 비밀번호"
 *                 example: "password123"
 *               s_nicname:
 *                 type: string
 *                 description: "학생 닉네임"
 *                 example: "nicname"
 *     responses:
 *       201:
 *         description: "학생 회원가입 성공"
 *       400:
 *         description: "잘못된 요청"
 */
router.post('/auth/s_signup', isNotLoggedIn, s_signup);

/**
 * @swagger
 * /auth/t_signup:
 *   post:
 *     tags: ["Auth"]
 *     summary: "교사 회원가입"
 *     description: "교사가 회원가입을 진행합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               t_name:
 *                 type: string
 *                 description: "교사 이름"
 *                 example: "교사1"
 *               t_id:
 *                 type: string
 *                 description: "교사 ID"
 *                 example: "teacher1"
 *               t_pass:
 *                 type: string
 *                 description: "교사 비밀번호"
 *                 example: "password123"
 *               t_nicname:
 *                 type: string
 *                 description: "교사 닉네임"
 *                 example: "nicname"
 *               t_subject:
 *                 type: string
 *                 description: "교사 과목"
 *                 example: "math"
 *     responses:
 *       201:
 *         description: "교사 회원가입 성공"
 *       400:
 *         description: "잘못된 요청"
 */
router.post('/auth/t_signup', isNotLoggedIn, t_signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags: ["Auth"]
 *     summary: "로그인"
 *     description: "사용자가 로그인합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: "아이디"
 *                 example: "student1"
 *               password:
 *                 type: string
 *                 description: "비밀번호"
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "로그인 성공"
 *       400:
 *         description: "잘못된 아이디나 비밀번호"
 */
router.post('/auth/signin', isNotLoggedIn, signin);

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     tags: ["Auth"]
 *     summary: "로그아웃"
 *     description: "사용자가 로그아웃합니다."
 *     responses:
 *       200:
 *         description: "로그아웃 성공"
 */
router.post('/auth/signout', isLoggedIn, signout);

/**
 * @swagger
 * /post/create:
 *   post:
 *     tags: ["Post"]
 *     summary: "게시글 생성"
 *     description: "사용자가 게시글을 생성합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               p_title:
 *                 type: string
 *                 description: "게시글 제목"
 *                 example: "게시글 제목"
 *               p_content:
 *                 type: string
 *                 description: "게시글 내용"
 *                 example: "게시글 내용"
 *     responses:
 *       201:
 *         description: "게시글 생성 성공"
 */
router.post('/post/create', isLoggedIn, createPost);

/**
 * @swagger
 * /post:
 *   get:
 *     tags: ["Post"]
 *     summary: "게시글 목록 조회"
 *     description: "모든 게시글 목록을 조회합니다."
 *     responses:
 *       200:
 *         description: "게시글 목록"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   p_id:
 *                     type: string
 *                     format: int
 *                     description: "게시물 아이디"
 *                     example: "1"
 *                   p_title:
 *                     type: string
 *                   p_content:
 *                     type: string
 *                   s_id:
 *                     type: string
 *                   t_id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: "생성된 날짜와 시간"
 *                     example: "2024-11-20T14:30:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: "마지막으로 수정된 날짜와 시간"
 *                     example: "2024-11-20T15:00:00Z"
 */
router.get('/post', isLoggedIn, readPosts);

/**
 * @swagger
 * /post/{p_id}:
 *   get:
 *     tags: ["Post"]
 *     summary: "게시글 조회"
 *     description: "특정 게시글을 조회합니다."
 *     parameters:
 *       - in: path
 *         name: p_id
 *         required: true
 *         schema:
 *           type: int
 *         description: "게시글 ID"
 *     responses:
 *       200:
 *         description: "게시글 조회 성공"
 *       404:
 *         description: "게시글을 찾을 수 없음"
 */
router.get('/post/:p_id', isLoggedIn, readPost);

/**
 * @swagger
 * /post/update/{p_id}:
 *   put:
 *     tags: ["Post"]
 *     summary: "게시글 수정"
 *     description: "특정 게시글을 수정합니다."
 *     parameters:
 *       - in: path
 *         name: p_id
 *         required: true
 *         schema:
 *           type: int
 *         description: "게시글 ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               p_title:
 *                 type: string
 *                 description: "수정할 제목"
 *               p_content:
 *                 type: string
 *                 description: "수정할 내용"
 *     responses:
 *       200:
 *         description: "게시글 수정 성공"
 *       404:
 *         description: "게시글을 찾을 수 없음"
 */
router.put('/post/update/:p_id', isLoggedIn, updatePost);

/**
 * @swagger
 * /post/{p_id}/comment/create:
 *   post:
 *     tags: ["Comment"]
 *     summary: "댓글 생성"
 *     description: "게시글에 댓글을 생성합니다."
 *     parameters:
 *       - in: path
 *         name: p_id
 *         required: true
 *         schema:
 *           type: string
 *         description: "게시글 ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               c_content:
 *                 type: string
 *                 description: "댓글 내용"
 *                 example: "댓글 내용"
 *     responses:
 *       201:
 *         description: "댓글 생성 성공"
 */
router.post('/post/:p_id/comment/create', isLoggedIn, createComment);

/**
 * @swagger
 * /post/{p_id}/comments:
 *   get:
 *     tags: ["Comment"]
 *     summary: "댓글 목록 조회"
 *     description: "특정 게시글의 댓글 목록을 조회합니다."
 *     parameters:
 *       - in: path
 *         name: p_id
 *         required: true
 *         schema:
 *           type: int
 *         description: "게시글 ID"
 *     responses:
 *       200:
 *         description: "댓글 목록 조회 성공"
 */
router.get('/post/:p_id/comments', isLoggedIn, readComments);

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: ["Profile"]
 *     summary: "사용자 프로필 조회"
 *     description: "로그인된 사용자의 프로필을 조회합니다. 학생과 교사에 따라 다르게 반환됩니다."
 *     responses:
 *       200:
 *         description: "프로필 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 t_id:
 *                   type: string
 *                   description: "교사 ID (교사일 경우)"
 *                   example: "teacher123"
 *                 t_name:
 *                   type: string
 *                   description: "교사 이름 (교사일 경우)"
 *                   example: "김선생"
 *                 t_nicname:
 *                   type: string
 *                   description: "교사 닉네임 (교사일 경우)"
 *                   example: "kim_teacher"
 *                 s_id:
 *                   type: string
 *                   description: "학생 ID (학생일 경우)"
 *                   example: "student456"
 *                 s_name:
 *                   type: string
 *                   description: "학생 이름 (학생일 경우)"
 *                   example: "홍길동"
 *                 s_nicname:
 *                   type: string
 *                   description: "학생 닉네임 (학생일 경우)"
 *                   example: "hong"
 *       400:
 *         description: "잘못된 사용자 유형"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user type."
 *       401:
 *         description: "인증되지 않은 사용자"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */

router.get('/profile', isLoggedIn, renderProfile);

/**
 * @swagger
 * /profile/nicnameChange:
 *   put:
 *     tags: ["Profile"]
 *     summary: "닉네임 변경"
 *     description: "사용자가 닉네임을 변경합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newnicname:
 *                 type: string
 *                 description: "새로운 닉네임"
 *                 example: "새로운닉네임"
 *     responses:
 *       200:
 *         description: "닉네임 변경 성공"
 *       400:
 *         description: "이미 존재하는 닉네임입니다."
 */
router.put('/profile/nicnameChange', isLoggedIn, NicnameChange);

/**
 * @swagger
 * /notice:
 *   get:
 *     summary: "공지사항 크롤링"
 *     description: "공지사항을 크롤링하여 DB에 저장합니다."
 *     responses:
 *       200:
 *         description: "크롤링 완료"
 *       500:
 *         description: "서버 오류"
 */

router.get('/notice', async (req, res) => {
  try {
    await crawlNotices();  // 크롤링 실행
    res.status(200).json({ message: 'Crawling completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Crawling failed', error: error.message });
  }
});

module.exports = router;
