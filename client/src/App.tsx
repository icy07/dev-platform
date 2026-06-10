import { useEffect } from "react";
import { checkAuthRequest, logoutRequest } from "./api/authApi";
import { useNavigate } from "react-router-dom";

const App = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await checkAuthRequest();
			} catch (error) {
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
		<div>
			App
			<button onClick={handleLogOut}>Log out</button>
		</div>
	);
};
export default App;
