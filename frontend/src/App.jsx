import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./utils/Layout";

import axios from "axios";
axios.defaults.withCredentials = true;
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExpensesPage from "./pages/ExpensePage";
import NotFoundPage from "./pages/NotFoundPage";
import useAuthCheck from "./hooks/useAuthcheck";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <ExpensesPage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

function App() {
	useAuthCheck();
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	);
}

export default App;
