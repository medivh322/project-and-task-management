import { createSelector } from "@reduxjs/toolkit";
import { LOGIN, SIGNUP, SIGN_REDUCER } from "./types";

const signSelect = (state: any) => state[SIGN_REDUCER];
export const selectSignIn = createSelector(signSelect, (sign) => sign[LOGIN]);
export const selectSignUp = createSelector(signSelect, (sign) => sign[SIGNUP]);
