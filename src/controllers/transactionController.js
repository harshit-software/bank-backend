const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const Ledger = require("../models/Ledger");
const Account = require("../models/Account");

const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  if (!fromAccount || !toAccount || !amount) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than zero",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(fromAccount) ||
    !mongoose.Types.ObjectId.isValid(toAccount)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid account id",
    });
  }

  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "Idempotency key is required",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const fromUserAccount =
      await Account.findById(fromAccount).session(session);

    const toUserAccount = await Account.findById(toAccount).session(session);

    if (!fromUserAccount || !toUserAccount) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (fromUserAccount._id.equals(toUserAccount._id)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Cannot transfer to same account",
      });
    }

    if (
      fromUserAccount.status !== "ACTIVE" ||
      toUserAccount.status !== "ACTIVE"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Both accounts must be ACTIVE",
      });
    }

    const existingTransaction = await Transaction.findOne({
      idempotencyKey,
    }).session(session);

    if (existingTransaction) {
      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: "Duplicate transaction request",
        transaction: existingTransaction,
      });
    }

    const balance = await fromUserAccount.getBalance(session);

    if (balance < amount) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const transaction = new Transaction({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    });

    await transaction.save({ session });

    const debitEntry = new Ledger({
      account: fromAccount,
      amount,
      transaction: transaction._id,
      status: "DEBIT",
    });

    const creditEntry = new Ledger({
      account: toAccount,
      amount,
      transaction: transaction._id,
      status: "CREDIT",
    });

    await debitEntry.save({ session });

    await creditEntry.save({ session });

    transaction.status = "COMPLETED";

    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      const existingTransaction = await Transaction.findOne({
        idempotencyKey,
      });

      return res.status(409).json({
        success: false,
        message: "Duplicate transaction request",
        transaction: existingTransaction,
      });
    }

    console.error("Transaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating transaction",
    });
  } finally {
    await session.endSession();
  }
};

const addInitialFunds = async (req, res) => {
  const { toAccount, amount } = req.body;

  if (!toAccount || !amount) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than zero",
    });
  }

  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "Idempotency key is required",
    });
  }

  const isAccount = await Account.findById(toAccount);

  if (!isAccount) {
    return res.status(404).json({
      success: false,
      message: "Account not found",
    });
  }

  const fromAccount = req.systemUser;
  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = new Transaction({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  await transaction.save({ session });

  const debitEntry = new Ledger({
    account: fromAccount,
    amount,
    transaction: transaction._id,
    status: "DEBIT",
  });

  const creditEntry = new Ledger({
    account: toAccount,
    amount,
    transaction: transaction._id,
    status: "CREDIT",
  });

  await debitEntry.save({ session });
  await creditEntry.save({ session });

  transaction.status = "COMPLETED";

  await transaction.save({ session });
  await session.commitTransaction();
  await session.endSession();

  return res.status(201).json({
    success: true,
    message: "Initial funds added successfully",
    transaction,
  });
};

module.exports = {
  createTransaction,
  addInitialFunds,
};
