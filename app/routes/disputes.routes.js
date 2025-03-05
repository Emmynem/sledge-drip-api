import { checks } from "../middleware/index.js";
import { dispute_rules } from "../rules/disputes.rules.js";
import { order_rules } from "../rules/orders.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	getDispute, getDisputes, getDisputesSpecifically, rootGetDispute, rootGetDisputes, rootGetDisputesSpecifically
} from "../controllers/disputes.controller.js";

export default function (app) {
	app.get("/root/disputes/all", [checks.verifyKey, checks.isRootKey], rootGetDisputes);
	app.get("/root/disputes/via/order", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrderAlt], rootGetDisputesSpecifically);
	app.get("/root/dispute", [checks.verifyKey, checks.isRootKey, dispute_rules.forFindingDispute], rootGetDispute);

	app.get("/user/disputes", [checks.verifyToken, checks.isUser], getDisputes);
	app.get("/user/disputes/via/order", [checks.verifyToken, checks.isUser, order_rules.forFindingOrderAlt], getDisputesSpecifically);
	app.get("/user/dispute", [checks.verifyToken, checks.isUser, dispute_rules.forFindingDispute], getDispute);
};
