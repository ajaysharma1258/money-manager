const express = require("express");
const router = express.Router();

const {
  getAccounts,
  createAccount,
  getAccountTransactions,
} = require("../controllers/accountController");

router.get("/", getAccounts);
router.post("/", createAccount);

// account history
router.get("/:name/transactions", getAccountTransactions);

module.exports = router;
