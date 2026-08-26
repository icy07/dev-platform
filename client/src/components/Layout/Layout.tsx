import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { checkAuthRequest } from "../../api/authApi";
import { setUser } from "../../store/slices/authSlice";
import Loader from "../Loader/Loader";
import PostModal from "../PostModal/PostModal";
import ProfileModal from "../ProfileModal/ProfileModal";

const Layout = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const { user } = useSelector((state: RootState) => state.auth);

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

		if (!user) {
			checkAuth();
		}
	}, [dispatch, navigate, user]);

	return (
		<>
			<Header />
			{loading && <Loader />}

			<main className="main">
				<Outlet />
			</main>
			<PostModal />
			<ProfileModal />
		</>
	);
};
export default Layout;
