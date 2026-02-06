# 💰 Money Manager - Backend

Backend API for Money Manager application.  
Handles transactions, accounts, categories, and transfer updates with MongoDB Atlas.

---

## 🚀 Live API
🔗 Backend URL: **(Add your deployed Render link here)**

Example:



---

## 🧠 Features

    REST API for Transactions  
    REST API for Accounts  
    Income / Expense tracking  
    Transfers between accounts  
    MongoDB Atlas integration  
    CRUD operations  
    CORS enabled for frontend deployment  

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- cors

---

## 📂 Project Structure

money-manager-backend/
├── models/
├── routes/
├── controllers/
├── server.js
├── package.json
├── .env

## ⚙️ Installation & Setup

### 1️. Clone the repo

    git clone https://github.com/<your-username>/money-manager-backend.git

    cd money-manager-backend


### 2. Install Dependencies

    npm install

### 3. Create .env file

    Create a .env file in the root folder:

    MONGO_URI=your_mongodb_atlas_connection_string

    Example:


    MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moneymanager


### 4. Run Locally

    npm run dev

    API will run at:

                    http://localhost:5000


API Endpoints

                     Transactions

Method	        Endpoint	                       Description
GET	            /api/transactions	            Get all transactions
POST	        /api/transactions	            Add new transaction
PUT	            /api/transactions/:id	        Update transaction
DELETE	        /api/transactions/:id	        Delete transaction


                    Accounts

Method	        Endpoint	                        Description
GET	            /api/accounts	                Get all accounts
POST	        /api/accounts	                Create account
PUT	            /api/accounts/:id	            Update account
DELETE	        /api/accounts/:id	            Delete account