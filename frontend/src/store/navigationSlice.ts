// store/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  currentPage: string;
  selectedId?: string;
}

const initialState: NavigationState = {
  currentPage: 'home',
  selectedId: undefined,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<{ page: string; id?: string }>) => {
      state.currentPage = action.payload.page;
      state.selectedId = action.payload.id;
    },
  },
});

export const { navigate } = navigationSlice.actions;
export default navigationSlice.reducer;
