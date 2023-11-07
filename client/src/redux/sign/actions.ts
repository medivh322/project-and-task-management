import * as authService from '../../services'
import { signActions } from "./reducer";
import { SIGNIN, SIGNUP } from './types';

export const login = ({ loginData }: any) =>
    async (dispatch: any) => {
        dispatch(signActions.REQUEST_LOADING({ keyState: SIGNIN }));
        const data = await authService.login({ loginData })
        if (data.success === true) {
            window.localStorage.setItem('isLoggenIn', "true");
            dispatch(signActions.SIGNIN_SUCCESS());
        } else {
            dispatch(signActions.REQUEST_FAILED({ keyState: SIGNIN }));
        }
    }

export const signup = ({ regData }: any) =>
    async (dispatch: any) => {
        dispatch(signActions.REQUEST_LOADING({ keyState: SIGNUP }));
        const data = await authService.signup({ regData })
        if (data.success === true) {
            window.localStorage.setItem('isLoggenIn', 'true');
            dispatch(signActions.SIGNIN_SUCCESS());
            dispatch(signActions.REQUEST_SUCCESS({ keyState: SIGNUP }));
        } else {
            dispatch(signActions.REQUEST_FAILED({ keyState: SIGNUP }));
        }
    }

export const checkAuth = () : boolean => {
    const result = window.localStorage.getItem('isLoggenIn');
    if (result) return true;

    return false;
}