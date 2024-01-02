import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

import { authJwtController } from '@controllers/coreControllers/authJwtController';
import { signupController } from '@controllers/coreControllers/signupController';
import { catchErrors } from '@handlerserrorHandlers';
import { env } from '@helpersindex';

interface IUser {
  id: string;
}

router.get('/auth', (req: express.Request, res: express.Response) => {
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
    res.status(200).json({
      success: true,
      id: verifed.id,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
    });
  }
});

router.post('/login', catchErrors(authJwtController.login));
router.post('/registration', catchErrors(signupController.signup));

export { router as coreAuthRouter };
