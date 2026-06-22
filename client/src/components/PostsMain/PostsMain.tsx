import { useSelector } from "react-redux";
import PostCard from "../PostCard/PostCard";
import styles from "./PostsMain.module.scss";
import type { RootState } from "../../store/store";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const PostsMain = () => {
	const { posts } = useSelector((state: RootState) => state.posts);

	return (
		<ResponsiveMasonry
			className={styles.wrapper}
			columnsCountBreakPoints={{
				350: 1,
				650: 2,
				930: 3,
				1200: 4,
				1500: 5,
			}}
		>
			<Masonry gutter="20px">
				{posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
			</Masonry>
		</ResponsiveMasonry>
	);
};
export default PostsMain;
