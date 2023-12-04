import { reducer as kanbanReducer } from "./kanban";
import { combineReducers } from "@reduxjs/toolkit";
import { projectsApi } from "./kanban/reducer";
import { loggenApi } from "./sign/reducer";
import taskApi from "./task/reducer";
import { reducer as commonReducer } from "./common";

const rootReducer = combineReducers({
  [kanbanReducer.name]: kanbanReducer.reducer,
  [commonReducer.name]: commonReducer.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [loggenApi.reducerPath]: loggenApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
});

export default rootReducer;
