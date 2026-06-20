import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post, PostType, UserRole } from "../../types";

interface PostsFilter {
	type: PostType | null;
	direction: UserRole | null;
}

interface PostsState {
	posts: Post[];
	isLoading: boolean;
	filters: PostsFilter;
}

const initialState: PostsState = {
	posts: [],
	isLoading: false,
	filters: {
		type: null,
		direction: null,
	},
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setPosts: (state, action: PayloadAction<Post[]>) => {
			state.posts = action.payload;
		},
		addPost: (state, action: PayloadAction<Post>) => {
			state.posts.unshift(action.payload);
		},
		updatePost: (state, action: PayloadAction<Post>) => {
			const index = state.posts.findIndex((p) => p._id === action.payload._id);
			if (index !== -1) state.posts[index] = action.payload;
		},
		removePost: (state, action: PayloadAction<string>) => {
			state.posts = state.posts.filter((p) => p._id !== action.payload);
		},
		toggleLike: (state, action: PayloadAction<string>) => {
			const post = state.posts.find((p) => p._id === action.payload);
			if (!post) return;

			if (post.isLikedByUser) {
				post.likes -= 1;
				post.isLikedByUser = false;
			} else {
				post.likes += 1;
				post.isLikedByUser = true;
			}
		},
		setPostFilters: (state, action: PayloadAction<Partial<PostsFilter>>) => {
			state.filters = { ...state.filters, ...action.payload };
		},
		clearPostFilters: (state) => {
			state.filters = initialState.filters;
		},
		setPostsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
	},
});

export const {
	setPosts,
	addPost,
	updatePost,
	removePost,
	toggleLike,
	setPostFilters,
	clearPostFilters,
	setPostsLoading,
} = postsSlice.actions;

export default postsSlice.reducer;
