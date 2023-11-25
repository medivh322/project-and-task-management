import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import { env } from '@helpers/';
import { User } from '@modelsuser.model';

const login = async (req: express.Request, res: express.Response) => {
  try {
    const { login, password } = req.body;

    const ObjectSchema = yup.object({
      login: yup
        .string()
        .min(3, 'Логин должен содержить минимум 3')
        .max(10, 'Логин не должен превышать 10 символов')
        .required('Пожалуйста, введите логин'),
      password: yup
        .string()
        .min(3, 'Пароль должен содержить минимум 3')
        .matches(/^[a-zA-Z0-9]+$/, 'Пароль должен содержать только латинские буквы и цифры')
        .required('Пожалуйста, введите пароль'),
    });

    await ObjectSchema.validate({ login, password }).catch((error) => {
      return res.status(400).json({
        success: false,
        message: error,
      });
    });

    const user: any = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Пользователя с таким логином не существует',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Неверные логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      env('JWT_SECRET'),
      { expiresIn: '24h' },
    );

    res
      .status(200)
      .cookie('token', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      })
      .json({
        success: true,
        message: 'Успешный вход',
        result: {
          id: user._id,
        },
      });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { login };
