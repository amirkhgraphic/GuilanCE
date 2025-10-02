import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './navigationSlice'; // example

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    // add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
