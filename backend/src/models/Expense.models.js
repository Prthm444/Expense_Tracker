import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [100, "Title must be less than 100 characters"],
		},
		category: {
			type: String,
			enum: {
				values: ["Food", "Travel", "Utilities", "Entertainment", "Other"],
				message:
					"Category must be one of: Food, Travel, Utilities, Entertainment, or Other",
			},
			required: [true, "Category is required"],
		},
		isRecurring: {
			type: Boolean,
			required: [true, "Please specify if this is a recurring expense"],
			default: false,
		},
		unitPrice: {
			type: Number,
			required: [true, "Unit price is required"],
			min: [0, "Unit price cannot be negative"],
		},
		quantity: {
			type: Number,
			required: [true, "Quantity is required"],
			min: [1, "Quantity must be at least 1"],
		},
		totalCost: {
			type: Number,
			default: 0,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

expenseSchema.pre("save", function (next) {
	this.totalCost = this.unitPrice * this.quantity;
	next();
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
