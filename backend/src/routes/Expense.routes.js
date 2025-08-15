import { Router } from "express";
import { addExpense, deleteExpense, getExpense, getMyExpenses, updateExpense } from "../controllers/Expense.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";

const router = Router();

router.route("/create").post(verifyJWT, addExpense);
router.route("/delete").post(verifyJWT, deleteExpense);

router.route("/update").post(verifyJWT, updateExpense);
router.route("/get").get(verifyJWT, getMyExpenses);
router.route("/get/:expense_id").get(verifyJWT, getExpense);

export default router;
