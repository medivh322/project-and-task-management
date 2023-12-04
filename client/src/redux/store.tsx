import { AnyAction, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { projectsApi } from "./kanban/reducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loggenApi } from "./sign/reducer";
import taskApi from "./task/reducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      projectsApi.middleware,
      loggenApi.middleware,
      taskApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
