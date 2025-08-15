# Expense Tracker

This is a full-stack expense tracker application that allows users to register, log in, and manage their expenses. The frontend is built with React and the backend is a Node.js/Express application.

Deployed Link : https://pratham-expense.vercel.app/

PostMan Pusblished Documentation :  https://documenter.getpostman.com/view/45894728/2sB3BHk8tp

## Features

-    User registration and login
-    JWT-based authentication
-    CRUD operations for expenses
-    Category filtering for expenses
-    Responsive UI

## Technologies Used

**Frontend:**

-    React
-    Redux Toolkit
-    React Router
-    Axios
-    Tailwind CSS
-    `react-toastify` for notifications

**Backend:**

-    Node.js
-    Express.js
-    MongoDB with Mongoose
-    JSON Web Tokens (JWT) for authentication
-    `bcrypt` for password hashing
-    `cors` for handling cross-origin requests

## Getting Started

### Prerequisites

-    Node.js (v14 or later)
-    npm
-    MongoDB

### Installation

1. **Clone the repository:**

     ```sh
     git clone <repository-url>
     cd expense-tracker
     ```

2. **Install backend dependencies:**

     ```sh
     cd backend
     npm install
     ```

3. **Install frontend dependencies:**
     ```sh
     cd ../frontend
     npm install
     ```

### Running the Application

1. **Start the backend server:**

     - Create a `.env` file in the `backend` directory with the environment variables listed below.
     - From the `backend` directory, run:
          ```sh
          npm start
          ```

2. **Start the frontend development server:**
     - Create a `.env` file in the `frontend` directory with the environment variables listed below.
     - From the `frontend` directory, run:
          ```sh
          npm run dev
          ```

## API Endpoints

### User

-    `POST /user/register`: Register a new user.
-    `POST /user/login`: Log in a user.
-    `POST /user/logout`: Log out a user.
-    `GET /user/verifyUser`: Verify the current user.

### Expense

-    `POST /expense/create`: Create a new expense.
-    `GET /expense/get`: Get all expenses for the logged-in user.
-    `GET /expense/get/:expense_id`: Get a single expense.
-    `POST /expense/update`: Update an expense.
-    `POST /expense/delete`: Delete an expense.

## Environment Variables

### Backend (`backend/.env`)

```
PORT=8000
MONGODB_URI=<your-mongodb-uri>
CORS_ORIGIN=<your-frontend-url>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```

### Frontend (`frontend/.env`)

```
VITE_SERVER_URL=<your-backend-api-url>
```

## Testing

To test the API, you can use the provided Postman collection:

1. Import the `Expense_Tracker_Focused.postman_collection.json` file located in /docs into Postman.

2. Run the requests in the collection to test the different API endpoints and scenarios.
