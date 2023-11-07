import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as kanbanTypes from "./types";

interface IProjectList {
    id: string,
    title: string,
}

interface ITask{
    id: string, 
    title: string,
}

interface IStatusGroup {
    id: string,
    title: string,
    tasksList: ITask[] | null
}

interface IKanban {
    currentProjectId: string | null,
    kanbanStatusGroupsSelectedProject: IStatusGroup[] | null,
    projectsList: IProjectList[] | null
}

const initialState: IKanban = {
    currentProjectId: null,
    kanbanStatusGroupsSelectedProject: [],
    projectsList: []
}

const kanbanSlice = createSlice({
    name: kanbanTypes.KANBAN_REDUCER,
    initialState,
    reducers: {
        [kanbanTypes.OPEN_BOARD]: (state, action: PayloadAction<{ id: string }>) => {
            state.currentProjectId = action.payload.id;
        }
    }
});

export const signReducerState = kanbanSlice.getInitialState;
export const signActions = kanbanSlice.actions
export default kanbanSlice;