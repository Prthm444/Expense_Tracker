import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";

import { setUser } from "../redux/slices/userSlice";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	const handleChange = (e) => {
		setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErrors({});
		setLoading(true);

		try {
			const res = await axios.post(`${SERVER_URL}/user/login`, formData, {
				withCredentials: true, // to send cookies
				headers: { "Content-Type": "application/json" },
			});
			dispatch(setUser({ user: res.data.data.user }));
			toast.success("Login successful!");
			navigate("/");
		} catch (err) {
			if (err.response && err.response.status === 400 && err.response.data.errors) {
				setFormErrors(err.response.data.errors);
				toast.error("Please correct the errors in the form.");
			} else {
				toast.error(
					err.response?.data?.message || "Login failed. Please try again."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
			<div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="username"
							className="block mb-2 font-medium text-gray-300"
						>
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Username"
							className={`w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								formErrors.username ? "border-red-500" : "border-gray-600"
							}`}
							value={formData.username}
							onChange={handleChange}
						/>
						{formErrors.username && (
							<p className="mt-2 text-sm text-red-500">{formErrors.username}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block mb-2 font-medium text-gray-300"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							className={`w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								formErrors.password ? "border-red-500" : "border-gray-600"
							}`}
							value={formData.password}
							onChange={handleChange}
							required
						/>
						{formErrors.password && (
							<p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
					<p className="text-center text-sm text-gray-600">
						Don’t have an account?{" "}
						<NavLink
							to="/register"
							className="text-blue-600 hover:underline hover:text-blue-700 font-medium"
						>
							Sign up here
						</NavLink>
					</p>
				</form>
			</div>
		</div>
	);
}