exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인한 상태입니다.');
    }
};

const cors = require('cors')

exports.corsDomain = async (req, res, next) => {
    cors({
        origin: req.get('origin'),
        credentials: include,
        optionsSuccessStatus: 200,
        allowedHeaders: 'Access-Control-Allow-Origin',
    })(req, res, next)
}
