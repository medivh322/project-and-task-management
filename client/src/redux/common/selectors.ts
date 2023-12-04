import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { COMMON_REDUCER } from "./types";

const commonState = (state: RootState) => state[COMMON_REDUCER];
export const selectCommon = createSelector(commonState, (state) => state);
