import { checks } from "../middleware/index.js";
import { transaction_rules } from "../rules/transactions.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	getTransaction, getTransactions, getTransactionsSpecifically, rootGetTransaction, rootGetTransactions, rootGetTransactionsSpecifically, deleteTransaction, webhookCompleteCryptoPayment, 
	rootFilterTransactions
} from "../controllers/transactions.controller.js";

export default function (app) {
	app.get("/root/transactions", [checks.verifyKey, checks.isRootKey], rootGetTransactions);
	app.get("/root/transactions/via/user", [checks.verifyKey, checks.isRootKey, user_rules.forFindingUserAlt], rootGetTransactionsSpecifically);
	app.get("/root/transactions/via/type", [checks.verifyKey, checks.isRootKey, transaction_rules.forFindingViaType], rootGetTransactionsSpecifically);
	app.get("/root/transactions/via/reference", [checks.verifyKey, checks.isRootKey, transaction_rules.forFindingViaReference], rootGetTransactionsSpecifically);
	app.get("/root/transactions/via/transaction/status", [checks.verifyKey, checks.isRootKey, transaction_rules.forFindingViaTransactionStatus], rootGetTransactionsSpecifically);
	app.get("/root/filter/transactions", [checks.verifyKey, checks.isRootKey, transaction_rules.forFiltering], rootFilterTransactions);
	app.get("/root/transaction", [checks.verifyKey, checks.isRootKey, transaction_rules.forFindingTransaction], rootGetTransaction);

	app.get("/user/transactions", [checks.verifyToken, checks.isUser], getTransactions);
	app.get("/user/transaction", [checks.verifyToken, checks.isUser, transaction_rules.forFindingTransaction], getTransaction);

	app.post("/webhook/crypto/payment", webhookCompleteCryptoPayment);

	app.delete("/user/transaction", [checks.verifyToken, checks.isUser, transaction_rules.forFindingTransaction], deleteTransaction);
};
