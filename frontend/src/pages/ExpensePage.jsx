import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaUtensils, FaPlane, FaLightbulb, FaFilm, FaQuestionCircle } from "react-icons/fa";
import UpdateExpenseModal from "../components/expense/UpdateExpenseModal";
import { setCategory, setExpenses, updateExpense, deleteExpense as deleteExpenseAction } from "../redux/slices/expenseSlice";

const categoryIcons = {
	Food: <FaUtensils />,
	Travel: <FaPlane />,
	Utilities: <FaLightbulb />,
	Entertainment: <FaFilm />,
	Other: <FaQuestionCircle />,
};

const categories = ["All", "Food", "Travel", "Utilities", "Entertainment", "Other"];

const ExpensesPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [deleteModal, setDeleteModal] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState(null);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [expenseToUpdate, setExpenseToUpdate] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState("");

	const [page, setPage] = useState(1);
	const [totalExpenses, setTotalExpenses] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 6;

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;
	const user = useSelector((state) => state.user.user);
	const myExpenses = useSelector((state) => state.expenses.expenses);

	useEffect(() => {
		const fetchMyExpenses = async () => {
			try {
				setLoading(true);
				setError("");
				let url = `${SERVER_URL}/expense/get?page=${page}&limit=${limit}`;
				if (selectedCategory) {
					url += `&category=${selectedCategory}`;
				}
				const response = await axios.get(url, { withCredentials: true });
				if (response.data && response.data.data) {
					dispatch(setExpenses(response.data.data.expenses || []));
					setTotalExpenses(response.data.data.totalExpenses || 0);
					setTotalPages(response.data.data.totalPages || 1);
				} else {
					dispatch(setExpenses([]));
					setTotalExpenses(0);
					setTotalPages(1);
				}
			} catch (err) {
				setError(err.response?.data?.message || "Unable to fetch your expenses. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchMyExpenses();
	}, [SERVER_URL, page, limit, dispatch, selectedCategory, deleteModal]);

	const handleEditClick = (expense) => {
		setExpenseToUpdate(expense);
		setIsUpdateModalOpen(true);
	};

	const handleDeleteClick = (expense) => {
		setSelectedExpense(expense);
		setDeleteModal(true);
	};

	const handleExpenseUpdated = (updatedExpense) => {
		dispatch(updateExpense(updatedExpense));
	};

	const handleCategoryChange = (e) => {
		setSelectedCategory(e.target.value);
		dispatch(setCategory(e.target.value));
		setPage(1);
	};

	const handleDeleteExpense = async () => {
		if (!selectedExpense) return;
		try {
			await axios.post(`${SERVER_URL}/expense/delete`, { expense_id: selectedExpense._id }, { withCredentials: true });
			toast.success("Expense deleted successfully!");
			dispatch(deleteExpenseAction(selectedExpense._id));
			setTotalExpenses((prev) => prev - 1);
			if (myExpenses.length === 1 && page > 1) {
				setPage(page - 1);
			}
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete expense. Please try again.");
		} finally {
			setDeleteModal(false);
			setSelectedExpense(null);
		}
	};

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-6">
				<h1 className="text-xl md:text-2xl font-semibold text-center mt-24">User not logged in. Please log in to see your expenses.</h1>
			</div>
		);
	}

	const renderPagination = () => {
		if (totalPages <= 1) return null;
		const pageNumbers = [];
		let start = Math.max(1, page - 2);
		let end = Math.min(totalPages, page + 2);
		if (page <= 3) end = Math.min(5, totalPages);
		if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);

		for (let i = start; i <= end; i++) {
			pageNumbers.push(i);
		}

		return (
			<div className="flex items-center justify-center gap-2 mt-10">
				<button
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					disabled={page === 1}
					className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Previous
				</button>
				{start > 1 && (
					<>
						<button
							onClick={() => setPage(1)}
							className={`px-3 py-1 rounded ${page === 1 ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
						>
							1
						</button>
						{start > 2 && <span className="text-gray-400">...</span>}
					</>
				)}
				{pageNumbers.map((num) => (
					<button
						key={num}
						onClick={() => setPage(num)}
						className={`px-3 py-1 rounded ${page === num ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
					>
						{num}
					</button>
				))}
				{end < totalPages && (
					<>
						{end < totalPages - 1 && <span className="text-gray-400">...</span>}
						<button
							onClick={() => setPage(totalPages)}
							className={`px-3 py-1 rounded ${page === totalPages ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
						>
							{totalPages}
						</button>
					</>
				)}
				<button
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					disabled={page === totalPages}
					className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
				</button>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 pt-12 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
					<div className="w-full md:w-auto">
						<select
							value={selectedCategory}
							onChange={handleCategoryChange}
							className="w-full md:w-64 bg-gray-800 border border-gray-700 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>
				</div>

				{isUpdateModalOpen && (
					<UpdateExpenseModal expense={expenseToUpdate} onClose={() => setIsUpdateModalOpen(false)} onExpenseUpdated={handleExpenseUpdated} />
				)}

				{loading && <p className="text-center text-blue-400 animate-pulse text-lg font-medium tracking-wide">Loading your expenses...</p>}

				{error && <p className="text-center text-red-500 font-semibold mb-8 max-w-xl mx-auto leading-relaxed tracking-wide">{error}</p>}

				{!loading && !error && myExpenses.length === 0 && (
					<div className="text-center">
						<h2 className="text-2xl font-semibold text-gray-300">No expenses found.</h2>
						<p className="mt-2 text-gray-400">Try adjusting your filters or add a new expense.</p>
					</div>
				)}

				{!loading && !error && myExpenses.length > 0 && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{myExpenses.map((expense) => (
								<div key={expense._id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
									<div>
										<div className="flex items-center justify-between mb-4">
											<span className="text-2xl text-blue-400">{categoryIcons[expense.category]}</span>
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full ${
													expense.isRecurring ? "bg-green-500 text-green-100" : "bg-gray-700 text-gray-300"
												}`}
											>
												{expense.isRecurring ? "Recurring" : "One-time"}
											</span>
										</div>
										<h2 className="text-2xl font-bold text-white mb-2 truncate">{expense.title}</h2>
										<p className="text-gray-400 mb-4">{expense.category}</p>

										<div className="border-t border-gray-700 my-4"></div>

										<div className="text-gray-300 space-y-2">
											<div className="flex justify-between">
												<span>Unit Price:</span>
												<span className="font-medium text-white">Rs. {expense.unitPrice.toFixed(2)}</span>
											</div>
											<div className="flex justify-between">
												<span>Quantity:</span>
												<span className="font-medium text-white">{expense.quantity}</span>
											</div>
											<div className="flex justify-between text-lg">
												<span className="font-semibold">Total:</span>
												<span className="font-bold text-blue-400">Rs. {expense.totalCost.toFixed(2)}</span>
											</div>
										</div>
									</div>
									<div className="mt-6">
										<p className="text-gray-500 text-sm mb-4 text-center">
											{new Date(expense.date).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
										<div className="flex justify-end space-x-2">
											<button
												onClick={() => handleEditClick(expense)}
												className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-semibold text-sm transition"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteClick(expense)}
												className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-sm transition"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
						{renderPagination()}
						<p className="text-center text-gray-400 mt-4 text-sm">
							Showing page {page} of {totalPages} &middot; {totalExpenses} expenses total
						</p>
					</>
				)}

				{deleteModal && (
					<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
						<div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
							<div className="flex flex-col space-y-4">
								<h3 className="text-xl font-semibold text-gray-100">Confirm Delete</h3>
								<p className="text-gray-300">
									Are you sure you want to delete the expense{" "}
									<span className="text-red-400 font-bold">{selectedExpense?.title}</span>?
								</p>
								<div className="flex justify-end space-x-3 pt-4">
									<button
										onClick={() => {
											setDeleteModal(false);
											setSelectedExpense(null);
										}}
										className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
									>
										Cancel
									</button>
									<button
										onClick={handleDeleteExpense}
										className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ExpensesPage;
