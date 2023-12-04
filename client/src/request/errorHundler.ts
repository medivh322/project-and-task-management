import { notification } from "antd";

import codeMessage from "./codeMessage";

export interface IError {
  status: keyof typeof codeMessage;
  data: { message: string };
}

export interface ErrorRes {
  error: IError;
}

const errorHandler = (errorRes: ErrorRes) => {
  const { error } = errorRes;
  console.log(error);
  if (error && error.status) {
    const errorText = codeMessage[error.status];
    const { status } = error;
    notification.config({
      duration: 5,
    });
    notification.error({
      message: `Ошибка ${status}`,
      description: errorText,
    });
    return error.data;
  } else {
    notification.config({
      duration: 5,
    });
    notification.error({
      message: "No internet connection",
      description: "Cannot connect to the server, Check your internet network",
    });
    return {
      success: false,
      result: null,
      message: "Cannot connect to the server, Check your internet network",
    };
  }
};

export default errorHandler;
