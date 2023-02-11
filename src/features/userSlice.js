import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  chatUser: null,
  chatId: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    login: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.chatUser = null;
      state.chatId = null;
    },
    changeActiveUser: (state, action) => {
      state.chatUser = action.payload;
    },
    changeChatId: (state, action) => {
      state.chatId = action.payload;
    }
  },
});

export const { login, logout, changeActiveUser, changeChatId } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state) => state.user.user;
export const selectChatUser = (state) => state.user.chatUser;
export const selectChatId = (state) => state.user.chatId;

export default userSlice.reducer;
