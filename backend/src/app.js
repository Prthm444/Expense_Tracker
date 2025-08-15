import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/User.routes.js";
import ExpenseRouter from "./routes/Expense.routes.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();
const allowedOrigins = process.env.CORS_ORIGIN;
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	})
);
// app.use(
// 	cors({
// 		origin: process.env.CORS_ORIGIN,
// 		credentials: true,
// 	})
// );
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/etracker/test", (req, res) => {
	res.status(200).send("hii from server, I am alive btw");
});

app.use("/user", UserRouter);
app.use("/expense", ExpenseRouter);

import { errorHandler } from "./middlewares/Error.middlewares.js";

app.use(errorHandler);

export { app };
