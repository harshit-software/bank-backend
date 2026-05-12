const Transaction = require("../models/Transaction");
const Ledger = require("../models/Ledger");
const Account = require("../models/Account");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/email");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  const fromUserAccount = await Account.findOne({ _id: fromAccount });
  const toUserAccount = await Account.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res
      .status(404)
      .json({ success: false, message: "Account not found" });
  }

  if (fromUserAccount === toUserAccount) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot transfer to same account" });
  }

  const isTransactionExists = await Transaction.findOne({
    idempotencyKey,
  });

  if (isTransactionExists) {
    if (isTransactionExists.status === "COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Transaction already completed",
        transaction: isTransactionExists,
      });
    } else if (isTransactionExists.status === "PENDING") {
      return res.status(409).json({
        success: false,
        message: "Transaction is pending",
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Transaction failed previously",
      });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      success: false,
      message: "Both accounts must be active to perform transaction",
    });
  }

  if (fromUserAccount.getBalance() < amount) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient balance" });
  }
  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Amount must be greater than zero" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = await Transaction.create(
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
      { session },
    );

    const debitEntry = new Ledger(
      {
        account: fromAccount,
        amount,
        transaction: transaction._id,
        status: "DEBIT",
      },
      { session },
    );

    const creditEntry = new Ledger(
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        status: "CREDIT",
      },
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });
    await debitEntry.save({ session });
    await creditEntry.save({ session });

    await session.commitTransaction();
    await sendEmail(
      req.user.email,
      "Transaction Completed",
      "Your transaction has been completed successfully.",
    );
    res.status(201).json({
      success: true,
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ success: false, message: "Error creating transaction" });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createTransaction,
};
