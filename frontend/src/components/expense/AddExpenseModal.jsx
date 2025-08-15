import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addExpense } from "../../redux/slices/expenseSlice";

const AddExpenseModal = ({ onClose }) => {
	const [formData, setFormData] = useState({
		title: "",
		category: "Food",
		isRecurring: false,
		unitPrice: "",
		quantity: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const dispatch = useDispatch();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (parseInt(formData.quantity) <= 0) {
			toast.error("Quantity should be atleast 1");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(`${SERVER_URL}/expense/create`, formData, { withCredentials: true });
			toast.success("Expense added successfully!");
			dispatch(addExpense(response.data.data));
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to add expense. Please try again.");
			toast.error(err.response?.data?.message || "Failed to add expense. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
			<div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
				<h2 className="text-2xl font-bold text-white mb-6">Add New Expense</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-300">
							Title
						</label>
						<input
							type="text"
							name="title"
							id="title"
							value={formData.title}
							onChange={handleChange}
							className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label htmlFor="category" className="block text-sm font-medium text-gray-300">
							Category
						</label>
						<select
							name="category"
							id="category"
							value={formData.category}
							onChange={handleChange}
							className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						>
							<option>Food</option>
							<option>Travel</option>
							<option>Utilities</option>
							<option>Entertainment</option>
							<option>Other</option>
						</select>
					</div>
					<div className="flex items-center">
						<input
							id="isRecurring"
							name="isRecurring"
							type="checkbox"
							checked={formData.isRecurring}
							onChange={handleChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-300">
							Recurring Expense
						</label>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="unitPrice" className="block text-sm font-medium text-gray-300">
								Unit Price
							</label>
							<input
								type="number"
								name="unitPrice"
								id="unitPrice"
								value={formData.unitPrice}
								onChange={handleChange}
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
						<div>
							<label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
								Quantity
							</label>
							<input
								type="number"
								name="quantity"
								id="quantity"
								value={formData.quantity}
								onChange={handleChange}
								className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<div className="flex justify-end space-x-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
							disabled={loading}
						>
							{loading ? "Adding..." : "Add Expense"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddExpenseModal;
