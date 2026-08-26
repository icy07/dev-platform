import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/store.ts";

import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import "./index.scss";
import NotFound from "./pages/NotFound/NotFound.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import Layout from "./components/Layout/Layout.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "/profile/:id",
				element: <ProfilePage />,
			},
			{
				path: "/profile/:id/project/:projectId",
				element: <ProjectPage />,
			},
		],
	},
	{
		path: "/auth",
		element: <AuthPage />,
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
);
