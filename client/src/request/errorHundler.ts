import { notification } from 'antd';

import codeMessage from './codeMessage';

interface IError {
    response: {
        status: keyof typeof codeMessage,
        data: { message: string },
    }
}

const errorHandler = (error: IError) => {
    const { response } = error;

    if (response && response.status) {
        const message: string = response.data && response.data.message;

        const errorText = message || codeMessage[response.status];
        const { status } = response;
        notification.config({
            duration: 5,
        });
        notification.error({
            message: `Ошибка ${status}`,
            description: errorText,
        });
        return response.data;
    } else {
        notification.config({
            duration: 5,
        });
        notification.error({
            message: 'No internet connection',
            description: 'Cannot connect to the server, Check your internet network',
        });
        return {
            success: false,
            result: null,
            message: 'Cannot connect to the server, Check your internet network',
        };
    }
};

export default errorHandler;