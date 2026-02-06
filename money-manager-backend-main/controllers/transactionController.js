const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, accountFrom, accountTo } = req.body;

    // create transaction
    const transaction = await Transaction.create(req.body);

    // update balances
    if (type === "income") {
      await Account.findOneAndUpdate(
        { name: accountFrom },
        { $inc: { balance: amount } },
        { upsert: true, new: true }
      );
    }

    if (type === "expense") {
      await Account.findOneAndUpdate(
        { name: accountFrom },
        { $inc: { balance: -amount } },
        { upsert: true, new: true }
      );
    }

    if (type === "transfer") {
      if (!accountTo) {
        return res.status(400).json({ message: "Account To is required" });
      }

      // deduct from fromAccount
      await Account.findOneAndUpdate(
        { name: accountFrom },
        { $inc: { balance: -amount } },
        { upsert: true, new: true }
      );

      // add to toAccount
      await Account.findOneAndUpdate(
        { name: accountTo },
        { $inc: { balance: amount } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  const diffHours = (Date.now() - transaction.createdAt) / (1000 * 60 * 60);
  if (diffHours > 12) {
    return res.status(403).json({ message: "Edit time expired" });
  }

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
};
