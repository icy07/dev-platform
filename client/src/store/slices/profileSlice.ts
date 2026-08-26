import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project, UserProfile } from "../../types";

interface ProfileState {
	profile: UserProfile | null;
	profileModal: {
		isOpen: boolean;
	};
	projectModal: {
		isOpen: boolean;
		editInfo: Project | null;
	};
}

const initialState: ProfileState = {
	profile: null,
	profileModal: {
		isOpen: false,
	},
	projectModal: {
		isOpen: false,
		editInfo: null,
	},
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		setProfile: (state, action: PayloadAction<UserProfile>) => {
			state.profile = action.payload;
		},
		updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
			if (state.profile) {
				state.profile = { ...state.profile, ...action.payload };
			}
		},
		addProject: (state, action: PayloadAction<Project>) => {
			if (state.profile) {
				state.profile.portfolio.push(action.payload);
			}
		},
		updateProject: (state, action: PayloadAction<Project>) => {
			if (state.profile) {
				state.profile.portfolio = state.profile.portfolio.map((project) =>
					project._id === action.payload._id ? action.payload : project,
				);
			}
		},
		removeProject: (state, action: PayloadAction<string>) => {
			if (state.profile) {
				state.profile.portfolio = state.profile.portfolio.filter(
					(project) => project._id !== action.payload,
				);
			}
		},
		openProfileModal: (state) => {
			state.profileModal.isOpen = true;
		},
		closeProfileModal: (state) => {
			state.profileModal.isOpen = false;
		},
		openProjectModal: (state, action: PayloadAction<Project | null>) => {
			state.projectModal.isOpen = true;
			state.projectModal.editInfo = action.payload;
		},
		closeProjectModal: (state) => {
			state.projectModal.isOpen = false;
			state.projectModal.editInfo = null;
		},
	},
});

export const {
	setProfile,
	updateProfile,
	addProject,
	updateProject,
	removeProject,
	openProfileModal,
	openProjectModal,
	closeProfileModal,
	closeProjectModal,
} = profileSlice.actions;

export default profileSlice.reducer;
