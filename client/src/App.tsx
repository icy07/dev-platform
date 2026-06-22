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
	const [laoding, setLoading] = useState<boolean>(false);
	const { isOpen } = useSelector((state: RootState) => state.posts.modal);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true);

			try {
				const data = await checkAuthRequest();
				const postData = await getPostsRequest();

				dispatch(setUser(data.data));
				dispatch(setPosts(postData.data));

				setLoading(false);
			} catch (error) {
				setLoading(false);
				navigate("/auth");
			}
		};

		checkAuth();
	}, [navigate]);

	return (
		<div style={{ overflow: isOpen ? "hidden" : "auto" }}>
			{laoding && <Loader />}
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
