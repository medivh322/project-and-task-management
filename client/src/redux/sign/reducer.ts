import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as authTypes from "./types";
import { checkAuth } from "./actions";

interface ISign {
    [authTypes.SIGNIN]: {
        isLoading: boolean,
        isLoggenIn: boolean,
        isSuccess: boolean
    },
    [authTypes.SIGNUP]: {
        isLoading: boolean,
        isSuccess: boolean
    }
}

const initialState: ISign = {
    [authTypes.SIGNIN]: {
        isLoading: false,
        isLoggenIn: checkAuth(),
        isSuccess: false
    },
    [authTypes.SIGNUP]: {
        isLoading: false,
        isSuccess: false
    }
}

const signSlice = createSlice({
    name: authTypes.SIGN_REDUCER,
    initialState,
    reducers: {
        [authTypes.REQUEST_LOADING]: (state, action: PayloadAction<{ keyState: keyof ISign }>) => { 
            state[action.payload.keyState].isLoading = true 
        },
        [authTypes.REQUEST_FAILED]: (state, action: PayloadAction<{ keyState: keyof ISign }>) => { 
            state[action.payload.keyState].isLoading = false 
        },
        [authTypes.REQUEST_SUCCESS]: (state, action: PayloadAction<{ keyState: keyof ISign }>) => {
            state[action.payload.keyState].isLoading = false;
            state[action.payload.keyState].isSuccess = true;
        },
        [authTypes.SIGNIN_SUCCESS]: (state) => {
            state[authTypes.SIGNIN].isLoggenIn = true;
        },
    }
});

export type { ISign }
export const signReducerState = signSlice.getInitialState;
export const signActions = signSlice.actions
export default signSlice;