# Technical Documentation: Expense Tracker

## 1. Introduction

This document provides a detailed technical overview of the Expense Tracker application. The application is a full-stack solution designed to help users manage their expenses. It features a React-based frontend and a Node.js/Express backend, following the MERN stack architecture.

## 2. Architecture

The application is built using a MERN-like stack, which consists of:

-   **MongoDB**: A NoSQL database used to store user and expense data.
-   **Express.js**: A web application framework for Node.js, used to build the backend REST API.
-   **React**: A JavaScript library for building user interfaces, used for the frontend application.
-   **Node.js**: A JavaScript runtime environment that executes the backend code.

The frontend and backend are decoupled, communicating with each other through a RESTful API. The frontend is responsible for the user interface and user experience, while the backend handles the business logic, database interactions, and authentication.

## 3. Module Structure

### 3.1. Backend

The backend code is organized into the following directories:

-   `src/controllers`: Contains the business logic for handling API requests.
-   `src/db`: Contains the database connection logic.
-   `src/middlewares`: Contains the Express middleware, including authentication and error handling.
-   `src/models`: Contains the Mongoose schemas for the database models.
-   `src/routes`: Contains the API route definitions.
-   `src/utils`: Contains utility classes and functions.

### 3.2. Frontend

The frontend code is organized into the following directories:

-   `src/components`: Contains reusable React components.
-   `src/hooks`: Contains custom React hooks.
-   `src/pages`: Contains the main page components.
-   `src/redux`: Contains the Redux store, slices, and actions.
-   `src/services`: Contains the API service layer for making requests to the backend.
-   `src/styles`: Contains the global CSS styles.

## 4. Database Schemas

### 4.1. User Schema (`User.models.js`)

| Field      | Type     | Constraints                               |
| :--------- | :------- | :---------------------------------------- |
| `username` | `String` | Required, Unique, Trimmed                 |
| `email`    | `String` | Required, Unique, Lowercase               |
| `password` | `String` | Required                                  |

### 4.2. Expense Schema (`Expense.models.js`)

| Field         | Type      | Constraints                               |
| :------------ | :-------- | :---------------------------------------- |
| `title`       | `String`  | Required, Trimmed, Max Length: 100        |
| `category`    | `String`  | Required, Enum: ["Food", "Travel", "Utilities", "Entertainment", "Other"] |
| `isRecurring` | `Boolean` | Required, Default: `false`                |
| `unitPrice`   | `Number`  | Required, Min: 0                          |
| `quantity`    | `Number`  | Required, Min: 1                          |
| `totalCost`   | `Number`  | Default: 0                                |
| `createdBy`   | `ObjectId`| Required, Ref: "User"                     |
| `date`        | `Date`    | Default: `Date.now`                       |

## 5. API Endpoints

### 5.1. User API

| Method | Endpoint           | Description               |
| :----- | :----------------- | :------------------------ |
| `POST` | `/user/register`   | Registers a new user.     |
| `POST` | `/user/login`      | Logs in a user.           |
| `POST` | `/user/logout`     | Logs out a user.          |
| `GET`  | `/user/verifyUser` | Verifies the current user.|

### 5.2. Expense API

| Method | Endpoint               | Description                        |
| :----- | :--------------------- | :--------------------------------- |
| `POST` | `/expense/create`      | Creates a new expense.             |
| `GET`  | `/expense/get`         | Gets all expenses for the user.    |
| `GET`  | `/expense/get/:expense_id` | Gets a single expense by ID.       |
| `POST` | `/expense/update`      | Updates an expense.                |
| `POST` | `/expense/delete`      | Deletes an expense.                |

## 6. Authentication

Authentication is handled using JSON Web Tokens (JWT). When a user logs in, the backend generates an `accessToken` and a `refreshToken`. The `accessToken` is sent with each subsequent request in the `Authorization` header to authenticate the user. The `refreshToken` is used to obtain a new `accessToken` when the old one expires.

## 7. Error Handling

The backend has a centralized error handling middleware that catches all errors and sends a consistent JSON response to the client. The response includes a `message` and an optional `errors` object for validation errors. The frontend is set up to handle these error responses and display appropriate messages to the user.
