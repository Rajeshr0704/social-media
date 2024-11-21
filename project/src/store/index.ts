import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;