const yup = require('yup');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: String,
    password: String
})
const User = mongoose.model('User', userSchema);

const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        console.log(login, password)

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

        const { error } = ObjectSchema.validate({ login, password });
        if (error) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Данные не прошли проверку на соответствие правилам"
            })
        }

        const user = await User.findOne({ login: login })
        if (!user) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Пользователя с таким логином не существует"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Неверные логин или пароль"
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: req.body.remember ? 365 * 24 + 'h' : '24h' }
        )

        const result = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { isLoggedIn: 1 }, $push: { loggedSessions: token } },
            { new: true }
        ).exec()

        res
            .status(200)
            .cookie('token', token, {
                maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : null,
                sameSite: process.env.NODE_ENV === 'production' ? 'Lax' : 'none',
                httpOnly: process.env.NODE_ENV === 'production' ? true : false,
                secure: true,
                domain: req.hostname,
                Path: '/',
            })
            .json({
                success: true,
                result: {
                    _id: result._id,
                    name: result.name,
                    surname: result.surname,
                    role: result.role,
                    email: result.email,
                    photo: result.photo,
                    isLoggedIn: result.isLoggedIn > 0 ? true : false,
                },
                message: 'Успешный вход',
            });
    } catch (error) {
        res.status(500).json({ success: false, result: null, message: error.message, error: error });
    }
}

module.exports = login;