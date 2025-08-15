import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErrors({});
		setLoading(true);
		const SERVER_URL = import.meta.env.VITE_SERVER_URL;

		try {
			await axios.post(`${SERVER_URL}/user/register`, formData, {
				headers: { "Content-Type": "application/json" },
			});

			setFormData({ username: "", email: "", password: "" });
			navigate("/login");
			toast.success("Registration Successfull");
		} catch (err) {
			if (err.response && err.response.status === 400 && err.response.data.errors) {
				setFormErrors(err.response.data.errors);
				toast.error("Please correct the errors in the form.");
			} else {
				toast.error(err.response?.data?.message || "Registration failed. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
			<div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="username" className="block mb-2 font-medium text-gray-300">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Enter username"
							autoComplete="username"
							className={`w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								formErrors.username ? "border-red-500" : "border-gray-600"
							}`}
							value={formData.username}
							onChange={handleChange}
							required
						/>
						{formErrors.username && <p className="mt-2 text-sm text-red-500">{formErrors.username}</p>}
					</div>

					<div>
						<label htmlFor="email" className="block mb-2 font-medium text-gray-300">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="Enter email"
							autoComplete="email"
							className={`w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								formErrors.email ? "border-red-500" : "border-gray-600"
							}`}
							value={formData.email}
							onChange={handleChange}
							required
						/>
						{formErrors.email && <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>}
					</div>

					<div>
						<label htmlFor="password" className="block mb-2 font-medium text-gray-300">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Enter password"
							autoComplete="new-password"
							className={`w-full px-4 py-2 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								formErrors.password ? "border-red-500" : "border-gray-600"
							}`}
							value={formData.password}
							onChange={handleChange}
							required
							minLength={6}
						/>
						{formErrors.password && <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}
