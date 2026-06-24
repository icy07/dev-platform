import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import PostsMain from "../../components/PostsMain/PostsMain";
import PostModal from "../../components/PostModal/PostModal";
import { getPostsRequest } from "../../api/postsApi";
import { setPosts } from "../../store/slices/postsSlice";
import Loader from "../../components/Loader/Loader";

const HomePage = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();
	const filters = useSelector((state: RootState) => state.posts.filters);

	useEffect(() => {
		document.title = "Главная";
	}, []);

	useEffect(() => {
		const loadPosts = async () => {
			setLoading(true);

			try {
				const postData = await getPostsRequest(filters);
				dispatch(setPosts(postData.data));
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, [dispatch, filters]);

	return (
		<>
			{loading && <Loader />}

			<PostsMain />
			<PostModal />
		</>
	);
};
export default HomePage;
