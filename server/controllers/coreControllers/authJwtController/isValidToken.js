const jwt = require('jsonwebtoken');

const isValidToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Не найден токен, нужна повторная авторизация"
            })
        }

        const verifed = jwt.verify(token, process.env.JWT_SECRET);

        if (!verifed) {
            return res.status(401).json({
                success: false,
                message: "Токен не прошел верификацию, нужна повторная авторизация"
            })
        }

        next();
    } catch (error) {
        res.status(503).json({
            success: false,
            result: null,
            message: error.message,
            error: error,
        });
    }
}

module.exports = isValidToken;