const yup = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const User = mongoose.model('User');

const signup = async (req, res) => {
    try {
        const { login, password } = req.body;

        const ObjectSchema = yup.object({
            login: yup.string()
                .min(3, "Логин должен содержить минимум 3")
                .max(10, "Логин не должен превышать 10 символов")
                .required("Пожалуйста, введите логин"),
            password: yup.string()
                .min(3, "Пароль должен содержить минимум 3")
                .matches(/^[a-zA-Z0-9]+$/, "Пароль должен содержать только латинские буквы и цифры")
                .required("Пожалуйста, введите пароль"),
        })

        ObjectSchema.validate({ login, password })
            .catch((error) => {
                return res.status(400).json({
                    success: false,
                    message: error
                })
            });

        const checkUser = await User.findOne({ login: login })
        console.log(checkUser)
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "Пользователь с таким логином уже существует"
            })
        }

        const hashPassword = await bcrypt.hash(password, 3);

        const user = await User.create({
            login: login,
            password: hashPassword
        });

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res
            .status(200)
            .cookie('token', token, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            .json({
                success: true,
                message: 'Успешная регистрация',
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, error: error });
    }
}

module.exports = signup;