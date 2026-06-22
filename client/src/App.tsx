import { useEffect, useState } from "react";
import { checkAuthRequest } from "./api/authApi";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { setUser } from "./store/slices/authSlice";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import PostsMain from "./components/PostsMain/PostsMain";
import { setPosts } from "./store/slices/postsSlice";
import { getPostsRequest } from "./api/postsApi";
import PostModal from "./components/PostModal/PostModal";

const App = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();
	const filters = useSelector((state: RootState) => state.posts.filters);

	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true);

			try {
				const data = await checkAuthRequest();
				dispatch(setUser(data.data));
				setLoading(false);
			} catch {
				setLoading(false);
				navigate("/auth");
			}
		};

		checkAuth();
	}, [dispatch, navigate]);

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
		<div>
			{loading && <Loader />}
			<Header />
			<main className="main">
				{/* <Dashboard /> */}
				<PostsMain />
			</main>
			<PostModal />
		</div>
	);
};
export default App;
