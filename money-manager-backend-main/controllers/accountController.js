const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

exports.getAccounts = async (req, res) => {
  const accounts = await Account.find().sort({ createdAt: -1 });
  res.json(accounts);
};

exports.createAccount = async (req, res) => {
  try {
    const { name, balance } = req.body;

    const account = await Account.create({
      name,
      balance: balance || 0,
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// transactions history for a particular account
exports.getAccountTransactions = async (req, res) => {
  try {
    const { name } = req.params;

    const transactions = await Transaction.find({
      $or: [{ accountFrom: name }, { accountTo: name }],
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
