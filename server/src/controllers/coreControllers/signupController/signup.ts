import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import { env } from '@helpers/';
import { User } from '@modelsuser.model';

const signup = async (req: express.Request, res: express.Response) => {
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

    ObjectSchema.validate({ login, password }).catch((error: Error) => {
      return res.status(400).json({
        success: false,
        message: error,
      });
    });

    const checkUser = await User.findOne({ login });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует',
      });
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const user = await User.create({
      login,
      password: hashPassword,
    });

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
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Успешная регистрация',
        result: {
          _id: user._id,
        },
      });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

export { signup };
