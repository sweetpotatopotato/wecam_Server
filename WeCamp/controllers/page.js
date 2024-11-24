const Sequelize = require('sequelize');
const db = require('../models');
const passport = require('passport');

exports.createPost = async (req, res, next) => {
    const user = req.user;
    console.log(req.session);

    try {
        const {
            p_title,
            p_content,
        } = req.body;

        const s_id = user.s_id;
        const t_id = user.t_id;

        const post = await db.Post.create({
            p_title,
            p_content,
            s_id: s_id || "aaaa",
            t_id: t_id || "aaaa",
        });

        res.status(201).json({ post });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readPosts = async (req, res, next) => {
    try {
        const posts = await db.Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readPost = async (req, res, next) => {
    const p_id = req.params.p_id;
    try {
        const post = await db.Post.findOne({
            where: { p_id },
            include: [
                {
                    model: db.Comment,
                    where: { p_id },
                    required: false,
                }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


exports.updatePost = async (req, res, next) => {
    const p_id = req.params.p_id;
    const { p_title, p_content } = req.body;

    try {
        const post = await db.Post.findOne({ where: { p_id } });

        if (!post) {
            return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
        }

        await db.Post.update(
            { p_title, p_content },
            { where: { p_id } }
        );

        res.status(200).json({ message: '게시물이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.createComment = async (req, res, next) => {
    const p_id = req.params.p_id;
    const user = req.user;
    const s_id = user.s_id;
    const t_id = user.t_id;

    try {
        const { c_content } = req.body;

        const comment = await db.Comment.create({
            c_content,
            p_id,
            s_id: s_id || "aaaa",
            t_id: t_id || "aaaa",
        });

        res.status(201).json({ comment });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readComments = async (req, res, next) => {
    const p_id = req.params.p_id;
    try {
        const comments = await db.Comment.findAll({
            where: { p_id },
            order: [['createdAt', 'DESC']]
        });
        
        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: '댓글이 없습니다.' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


exports.renderProfile = (req, res) => {
    const { t_name, s_name, t_id, s_id, t_nicname, s_nicname } = req.user.dataValues;

    if (t_id !== undefined && t_id !== null) {
        return res.status(200).json({ t_id, t_name, t_nicname });
    } else if (s_id !== undefined && s_id !== null) {
        return res.status(200).json({ s_id, s_name, s_nicname });
    } else {
        return res.status(400).json({ message: "Invalid user type." });
    }
};

exports.NicnameChange = async (req, res) => {
    const userId = req.session.passport.user;
    const { newnicname } = req.body;

    if (!newnicname) {
        return res.status(400).json({ message: '닉네임을 입력하세요.' });
    }

    try {
        const existingStudent = await db.Students.findOne({
            where: { s_nicname: newnicname },
        });

        const existingTeacher = await db.Teachers.findOne({
            where: { t_nicname: newnicname },
        });

        if (existingStudent || existingTeacher) {
            return res.status(400).json({ message: '이미 존재하는 닉네임입니다.' });
        }

        const student = await db.Students.findOne({ where: { s_id: userId } });
        const teacher = await db.Teachers.findOne({ where: { t_id: userId } });

        if (student) {
            await db.Students.update(
                { s_nicname: newnicname },
                { where: { s_id: userId } }
            );
        } else if (teacher) {
            await db.Teachers.update(
                { t_nicname: newnicname },
                { where: { t_id: userId } }
            );
        } else {
            return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '닉네임이 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};