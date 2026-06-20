import { useDispatch, useSelector } from "react-redux";
import PostCard from "../PostCard/PostCard";
import styles from "./PostsMain.module.scss";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { getPostsRequest } from "../../api/postsApi";
import { setPosts } from "../../store/slices/postsSlice";

const PostsMain = () => {
	const { posts } = useSelector((state: RootState) => state.posts);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const getPosts = async () => {
			const data = await getPostsRequest();
			dispatch(setPosts(data.data));
		};

		getPosts();
	}, [posts]);

	return (
		<div className={styles.wrapper}>
			{posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
		</div>
	);
};
export default PostsMain;
