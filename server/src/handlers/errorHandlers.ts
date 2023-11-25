import { ErrorRequestHandler } from 'express';

const catchErrors = (fn: any) => {
  return function (req: any, res: any, next: any) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

// если передать 4 параметра, то ошибочные будут приходить сюда
const developmentErrors: ErrorRequestHandler = (error: any, req: any, res: any, next: any) => {
  error.stack = error.stack || '';
  res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

const notFound = (err: any, req: any, res: any, next: any) => {
  res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

export { developmentErrors, notFound, catchErrors };
