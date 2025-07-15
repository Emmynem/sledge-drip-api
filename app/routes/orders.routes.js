import { checks } from "../middleware/index.js";
import { product_rules } from "../rules/products.rules.js";
import { order_rules } from "../rules/orders.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addExternalOrder, addOrder, disputeOrderForRefund, getOrder, getOrders, getOrdersSpecifically, rootGetOrder, rootGetOrders, rootGetOrdersSpecifically, updateOrderCancelled, 
	updateOrderCompleted, updateOrderInTransit, updateOrderPaid, updateOrderShipped, publicGetOrder, publicGetOrdersSpecifically, initiateCryptoPayment, initiateWalletPayment, 
	publicGetWallets, initiateNairaPayment
} from "../controllers/orders.controller.js";

export default function (app) {
	app.get("/root/orders", [checks.verifyKey, checks.isRootKey], rootGetOrders);
	app.get("/root/orders/via/user", [checks.verifyKey, checks.isRootKey, user_rules.forFindingUserAlt], rootGetOrdersSpecifically);
	app.get("/root/orders/via/product", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProductAlt], rootGetOrdersSpecifically);
	app.get("/root/orders/via/tracking", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], rootGetOrdersSpecifically);
	app.get("/root/orders/via/delivery/status", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaDeliveryStatus], rootGetOrdersSpecifically);
	app.get("/root/orders/paid", [checks.verifyKey, checks.isRootKey, order_rules.forFindingPaidOrders], rootGetOrdersSpecifically);
	app.get("/root/orders/shipped", [checks.verifyKey, checks.isRootKey, order_rules.forFindingShippedOrders], rootGetOrdersSpecifically);
	app.get("/root/orders/disputed", [checks.verifyKey, checks.isRootKey, order_rules.forFindingDisputedOrders], rootGetOrdersSpecifically);
	app.get("/root/order", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrder], rootGetOrder);

	app.get("/user/orders/all", [checks.verifyKey, checks.isUser], getOrders);
	app.get("/user/orders/via/tracking", [checks.verifyKey, checks.isUser, order_rules.forFindingOrdersViaTrackingNumber], getOrdersSpecifically);
	app.get("/user/orders/via/delivery/status", [checks.verifyKey, checks.isUser, order_rules.forFindingOrdersViaDeliveryStatus], getOrdersSpecifically);
	app.get("/user/orders/paid", [checks.verifyKey, checks.isUser, order_rules.forFindingPaidOrders], getOrdersSpecifically);
	app.get("/user/orders/shipped", [checks.verifyKey, checks.isUser, order_rules.forFindingShippedOrders], getOrdersSpecifically);
	app.get("/user/orders/disputed", [checks.verifyKey, checks.isUser, order_rules.forFindingDisputedOrders], getOrdersSpecifically);
	app.get("/user/order", [checks.verifyKey, checks.isUser, order_rules.forFindingOrder], getOrder);

	app.get("/track/orders/via/tracking", [order_rules.forFindingOrdersViaTrackingNumber], publicGetOrdersSpecifically);
	app.get("/track/order", [order_rules.forFindingOrder], publicGetOrder);
	app.get("/wallets", publicGetWallets);

	app.post("/add/order", [checks.verifyToken, checks.isUser, order_rules.forAddingViaProducts], addOrder);
	app.post("/add/external/order", [order_rules.forAddingViaProducts], addExternalOrder);
	app.post("/initiate/order/payment", [order_rules.forFindingOrdersViaTrackingNumber], initiateCryptoPayment);
	app.post("/initiate/wallet/order/payment", [order_rules.forFindingOrdersViaTrackingNumber], initiateWalletPayment);
	app.post("/initiate/naira/order/payment", [order_rules.forFindingOrdersViaTrackingNumber], initiateNairaPayment);
	
	app.post("/user/order/dispute", [order_rules.forFindingOrder, order_rules.forDisputingRefund], disputeOrderForRefund);

	app.put("/order/pay", [checks.verifyKey, checks.isInternalKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderPaid);
	app.put("/user/order/pay", [checks.verifyKey, checks.isInternalKey, checks.verifyToken, checks.isUser, order_rules.forFindingOrdersViaTrackingNumber], updateOrderPaid);
	app.put("/root/user/order/pay", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderPaid);

	app.put("/order/cancel", [checks.verifyKey, checks.isInternalKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderCancelled);
	app.put("/user/order/cancel", [checks.verifyKey, checks.isInternalKey, checks.verifyToken, checks.isUser, order_rules.forFindingOrdersViaTrackingNumber], updateOrderCancelled);
	app.put("/root/user/order/cancel", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderCancelled);
	
	app.put("/root/user/order/shipping", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderInTransit);
	app.put("/root/user/order/shipped", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderShipped);
	app.put("/root/user/order/completed", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrdersViaTrackingNumber], updateOrderCompleted);
};
