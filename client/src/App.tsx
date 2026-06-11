import { useEffect, useState } from "react";
import { checkAuthRequest, logoutRequest } from "./api/authApi";
import { useNavigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";

const App = () => {
	const navigate = useNavigate();
	const [laoding, setLaoding] = useState<boolean>(false);

	useEffect(() => {
		const checkAuth = async () => {
			setLaoding(true);

			try {
				await checkAuthRequest();
				setLaoding(false);
			} catch (error) {
				setLaoding(false);
				navigate("/auth");
			}
		};

		checkAuth();
	}, [navigate]);

	const handleLogOut = async () => {
		try {
			await logoutRequest();
			navigate("/auth");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{laoding && <Loader />}
			<div>
				App
				<button onClick={handleLogOut}>Log out</button>
			</div>
		</>
	);
};
export default App;
