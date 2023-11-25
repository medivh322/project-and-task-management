import { createSelector } from "@reduxjs/toolkit";
import { KANBAN_REDUCER } from "./types";
import { RootState } from "../store";

const signKanban = (state: RootState) => state[KANBAN_REDUCER];
export const selectKanban = createSelector(signKanban, (sign) => sign);
