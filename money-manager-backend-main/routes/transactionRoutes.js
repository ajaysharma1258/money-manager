const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  updateTransaction
} = require("../controllers/transactionController");
const { deleteTransaction } = require("../controllers/transactionController");
router.delete("/:id", deleteTransaction);

router.post("/", addTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);

module.exports = router;
