import { createSelector } from "@reduxjs/toolkit";
import { SIGNIN, SIGNUP, SIGN_REDUCER } from "./types";
import { RootState } from "../store";

const signSelect = (state: RootState) => state[SIGN_REDUCER];
export const selectSignIn = createSelector(signSelect, (sign) => sign[SIGNIN])
export const selectSignUp = createSelector(signSelect, (sign) => sign[SIGNUP])