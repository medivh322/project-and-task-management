import { combineReducers } from "@reduxjs/toolkit";
import { projectsApi } from "./kanban/reducer";
import { loggenApi } from "./sign/reducer";
import taskApi from "./task/reducer";
import { reducer as commonReducer } from "./common";
import { reducer as kanbanReducer } from "./kanban";
import { commonApi } from "./common/reducer";

const rootReducer = combineReducers({
  [commonReducer.name]: commonReducer.reducer,
  [kanbanReducer.name]: kanbanReducer.reducer,
  [projectsApi.reducerPath]: projectsApi.reducer,
  [loggenApi.reducerPath]: loggenApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
});

export default rootReducer;
