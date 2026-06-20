import { useSelector } from "react-redux";
import PostCard from "../PostCard/PostCard";
import styles from "./PostsMain.module.scss";
import type { RootState } from "../../store/store";

const PostsMain = () => {
	const { posts } = useSelector((state: RootState) => state.posts);

	return (
		<div className={styles.wrapper}>
			{posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
		</div>
	);
};
export default PostsMain;
