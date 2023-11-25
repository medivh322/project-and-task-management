import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { Request } from 'express';
import { env } from '@helpers/';

interface IUser {
  id: string;
}

const isValidToken = async (req: Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Не найден токен, нужна повторная авторизация',
      });
    }

    const verifed = <IUser>jwt.verify(token, env('JWT_SECRET'));

    if (!verifed) {
      return res.status(401).json({
        success: false,
        message: 'Токен не прошел верификацию, нужна повторная авторизация',
      });
    }

    if (verifed.id) (req as any).userId = verifed.id;
    next();
  } catch (error: any) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};

export { isValidToken };
