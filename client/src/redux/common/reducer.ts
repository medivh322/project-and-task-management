import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { COMMON_REDUCER, LOADING_FULLSCREEN } from "./types";

const initialState = {
  isLoadingFullScreen: false,
};

const commonSlice = createSlice({
  name: COMMON_REDUCER,
  initialState,
  reducers: {
    [LOADING_FULLSCREEN]: (
      state,
      action: PayloadAction<{
        loading: boolean;
      }>
    ) => {
      state.isLoadingFullScreen = action.payload.loading;
    },
  },
});

export const commonReducerState = commonSlice.getInitialState;
export const commonReducerAction = commonSlice.actions;
export default commonSlice;
