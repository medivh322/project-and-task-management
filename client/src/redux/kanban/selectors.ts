import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { KANBAN_REDUCER } from "./types";

const kanbanState = (state: RootState) => state[KANBAN_REDUCER];
export const getKanban = createSelector(kanbanState, (state) => state);
