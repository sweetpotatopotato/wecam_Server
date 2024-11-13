const Sequelize = require('sequelize');
const db = require('../models');
const passport = require('passport');

exports.createLesson = async (req, res, next) => {
    console.log(req.body);
    try {
        const {
            l_title,
            l_content,
            l_year,
            l_semester,
            l_grade,
            l_class,
            l_place
        } = req.body;
        const { t_id } = req.user.dataValues;

        const lesson = await db.Lesson.create({
            l_title,
            l_content,
            l_year,
            l_semester,
            l_grade,
            l_class,
            l_place,
            t_id,
        });

        res.status(201).json({ lesson });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readLessons = async (req, res, next) => {
    const { t_id } = req.user.dataValues;
    try {
        const lessons = await db.Lesson.findAll({ where: { t_id } });
        res.status(200).json(lessons);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readLessonsData = async (req, res, next) => {
    const classof = req.user.dataValues.s_classof;
    const l_grade = Math.floor(classof / 1000);
    const l_class = Math.floor((classof % 1000) / 100);
    console.log("----------------");
    console.log(l_grade, l_class);
    console.log("----------------");
    try {
        const lessons = await db.Lesson.findAll({
            where: { l_grade, l_class },
            order: [['l_year', 'DESC'], ['l_semester', 'DESC']]
        });

        console.log(lessons);
        res.status(200).json(lessons);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readLesson = async (req, res, next) => {
    console.log(req.params);
    const { l_id } = req.params;
    const { t_id } = req.user.dataValues;
    try {
        const lesson = await db.Lesson.findOne({ where: { t_id, l_id } });
        if (!lesson) {
            return res.status(404).json({ message: '수업을 찾을 수 없습니다.' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.readLessonData = async (req, res, next) => {
    const classof = req.user.dataValues.s_classof;
    const l_grade = Math.floor(classof / 1000);
    const l_class = Math.floor((classof % 1000) / 100);
    const l_id = parseInt(req.params.id, 10);
    console.log("--------------------");
    console.log(l_grade, l_class, l_id);
    console.log("--------------------");
    console.log(req.params);
    try {
        const lessons = await db.Lesson.findOne({
            where: { l_grade, l_class, l_id },
        });

        console.log(lessons);
        res.status(200).json(lessons);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.updateLesson = async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.params.id);
    // console.log(req.params);
    // console.log(req.l_id);
    const l_id = req.params.id;
    const {
        l_title,
        l_content,
        l_year,
        l_semester,
        l_grade,
        l_class,
        l_place
    } = req.body;
    const { t_id } = req.user.dataValues;

    try {
        const lesson = await db.Lesson.findOne({ where: { l_id } });

        if (!lesson) {
            return res.status(404).json({ message: '수업을 찾을 수 없습니다.' });
        }

        if (lesson.t_id !== t_id) {
            return res.status(403).json({ message: '이 수업을 수정할 권한이 없습니다.' });
        }

        await db.Lesson.update(
            {
                l_title,
                l_content,
                l_year,
                l_semester,
                l_grade,
                l_class,
                l_place,
            },
            { where: { l_id } }
        );

        res.status(200).json({ message: '수업이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.renderProfile = (req, res) => {
    const userType = req.session.userRole;
    const userId = req.session.userId;
    const t_username = req.user.dataValues.t_name;
    const s_username = req.user.dataValues.s_name;
    const usersubject = req.user.dataValues.t_subject;
    const classof = req.user.dataValues.s_classof;
    console.log(req.user.dataValues);

    if (userType === "teacher") {
        return res.status(200).json({ userType, t_username, usersubject, userId });
    } else {
        return res.status(200).json({ userType, s_username, userId, classof });
    }
};

exports.renderPasswordChange = async (req, res) => {
    const userType = req.session.userRole;
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;
    console.log(userType, userId);
    console.log(currentPassword, newPassword);
    if (currentPassword && newPassword) {
        if (userType === "teacher") {
            const storedPassword = req.user.dataValues.t_pass;
            if (currentPassword !== storedPassword) {
                return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." });
            }

            try {
                console.log(userType);
                const user = await db.Teachers.findOne({ where: { t_id: userId } });
                await user.update({ t_pass: newPassword });
            } catch (err) {
                console.error("DB 업데이트 오류:", err);
                return res.status(500).json({ message: "비밀번호 변경 중 오류가 발생했습니다.", error: err });
            }
            return res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
        } else {
            const storedPassword = req.user.dataValues.s_pass;
            if (currentPassword !== storedPassword) {
                return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({ message: "비밀번호는 최소 8자 이상이어야 합니다." });
            }

            try {
                console.log(userType);
                const user = await db.Students.findOne({ where: { s_id: userId } });
                await user.update({ s_pass: newPassword });
                return res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
            } catch (err) {
                console.error("DB 업데이트 오류:", err);
                return res.status(500).json({ message: "비밀번호 변경 중 오류가 발생했습니다.", error: err });
            }
        }
    } else {
        return res.status(401).json({ message: "빈칸 없이 입력해주세요." });
    }
};

exports.renderOnboarding = (req, res) => {
    res.status(200).send("onboarding(시작화면)");
}

// exports.renderStudentsMain = (req, res) => {
//     res.status(200).send("학생 메인페이지");
// };

// exports.renderTeachersMain = (req, res) => {
//     res.status(200).send("선생님 메인페이지");
// };