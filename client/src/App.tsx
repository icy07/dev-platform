import { useEffect, useState } from "react";
import { checkAuthRequest } from "./api/authApi";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { setUser } from "./store/slices/authSlice";
import Header from "./components/Header/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import PostsMain from "./components/PostsMain/PostsMain";

const App = () => {
	const navigate = useNavigate();
	const [laoding, setLoading] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const checkAuth = async () => {
			setLoading(true);

			try {
				const data = await checkAuthRequest();
				dispatch(setUser(data.data));
				setLoading(false);
			} catch (error) {
				setLoading(false);
				navigate("/auth");
			}
		};

		checkAuth();
	}, [navigate]);

	return (
		<>
			{laoding && <Loader />}
			<Header />
			<main>
				<Dashboard />
				<PostsMain />
			</main>
		</>
	);
};
export default App;
