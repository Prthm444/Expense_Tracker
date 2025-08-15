import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	expenses: [],
	category: "All",
};

const expenseSlice = createSlice({
	name: "expenses",
	initialState,
	reducers: {
		setCategory: (state, action) => {
			state.category = action.payload;
		},
		addExpense: (state, action) => {
			if (state.category !== action.payload.category) return;
			state.expenses.unshift(action.payload);
		},
		setExpenses: (state, action) => {
			state.expenses = action.payload;
		},
		updateExpense: (state, action) => {
			const index = state.expenses.findIndex((e) => e._id === action.payload._id);
			if (index !== -1) {
				state.expenses[index] = action.payload;
			}
		},
		deleteExpense: (state, action) => {
			state.expenses = state.expenses.filter((e) => e._id !== action.payload);
		},
	},
});

export const { setCategory, addExpense, setExpenses, updateExpense, deleteExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
