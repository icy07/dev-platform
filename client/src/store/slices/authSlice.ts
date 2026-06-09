import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../types";

interface UserState {
	isAuthenticated: boolean;
	user: IUser | null;
}

const initialState: UserState = {
	isAuthenticated: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser>) => {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		removeUser: (state) => {
			state.isAuthenticated = false;
			state.user = null;
		},
	},
});

export const { setUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
