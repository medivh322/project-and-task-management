import axios from "axios";
import { API_BASE_URL } from "../config/serverApiConfig"
import errorHandler from "../request/errorHundler";
import successHandler from "../request/successHandler";

export const login = async ({ loginData }: any) => {
    try {
        const { data, status } : any = await axios.post(API_BASE_URL + 'login', loginData);
        successHandler(
            { data, status },
            {
                notifyOnSuccess: false,
                notifyOnFailed: true,
            }
        )
        return data;
    } catch (error: any) {
        return errorHandler(error);
    }
}

export const signup = async ({ regData }: any) => {
    try {
        const { data, status } : any = await axios.post(API_BASE_URL + 'registration', regData);
        successHandler(
            { data, status },
            {
                notifyOnSuccess: false,
                notifyOnFailed: true,
            }
        )
        return data;
    } catch (error: any) {
        return errorHandler(error);
    }
}