import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import expenseReducer from "./slices/expenseSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		expenses: expenseReducer,
	},
});
