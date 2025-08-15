import { asyncHandler } from "../utils/Async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import Expense from "../models/Expense.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const addExpense = asyncHandler(async (req, res) => {
	const { title, category, isRecurring, unitPrice, quantity, date } = req.body;

	if ([title, category, unitPrice, quantity].some((field) => field === undefined || field === null || (typeof field === "string" && field.trim() === ""))) {
		throw new ApiError(400, "Title, category, unitPrice, and quantity are required");
	}

	const newExpense = await Expense.create({
		title: title.trim(),
		category,
		isRecurring,
		unitPrice,
		quantity,
		date,
		createdBy: req.user,
	});

	if (!newExpense) {
		throw new ApiError(500, "Something went wrong while creating expense");
	}

	return res.status(201).json(new ApiResponse(200, newExpense, "Expense created successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
	const { expense_id } = req.body;

	if (!expense_id) {
		throw new ApiError(400, "Expense ID is required");
	}

	const expense = await Expense.findById(expense_id);

	if (!expense) {
		throw new ApiError(404, "Expense not found");
	}

	if (expense.createdBy.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You are not authorized to delete this expense");
	}

	await expense.deleteOne();

	return res.status(200).json(new ApiResponse(200, "Expense deleted successfully"));
});

const getExpense = asyncHandler(async (req, res) => {
	const expense_id = req.params.expense_id;

	const expense = await Expense.findById(expense_id).populate("createdBy", "username email");

	if (!expense) {
		throw new ApiError(404, "Expense not found");
	}

	return res.status(200).json(new ApiResponse(200, expense, "Fetched expense successfully"));
});

const updateExpense = asyncHandler(async (req, res) => {
	const { expense_id, title, category, isRecurring, unitPrice, quantity, date } = req.body;

	if (!expense_id) {
		throw new ApiError(400, "Expense ID is required");
	}

	const expense = await Expense.findById(expense_id);

	if (!expense) {
		throw new ApiError(404, "Expense not found");
	}

	if (expense.createdBy.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You are not authorized to update this expense");
	}

	if (title?.trim()) expense.title = title.trim();
	if (category) expense.category = category;
	if (typeof isRecurring === "boolean") expense.isRecurring = isRecurring;
	if (unitPrice !== undefined) expense.unitPrice = unitPrice;
	if (quantity !== undefined) expense.quantity = quantity;
	if (date) expense.date = date;

	await expense.save();

	return res.status(200).json(new ApiResponse(200, expense, "Expense updated successfully"));
});

const getMyExpenses = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	let { page = 1, limit = 5, category } = req.query;
	page = parseInt(page);
	limit = parseInt(limit);

	const query = { createdBy: userId };
	if (category && category.trim() !== "" && category !== "All") {
		query.category = category; // exact match
	}

	const totalExpenses = await Expense.countDocuments(query);

	const expenses = await Expense.find(query)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				expenses,
				totalExpenses,
				currentPage: page,
				totalPages: Math.ceil(totalExpenses / limit),
			},
			"Fetched your expenses successfully"
		)
	);
});

export { addExpense, deleteExpense, getExpense, updateExpense, getMyExpenses };
