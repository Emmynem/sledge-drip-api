import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, check_length_TEXT, default_delete_status, validate_payment_method, payment_methods, validate_gateway, gateways } from '../config/config.js';

const USERS = db.users;
const ORDERS = db.orders;
const PRODUCTS = db.products;
const Op = db.Sequelize.Op;

export const order_rules = {
    forFindingOrder: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return ORDERS.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Order not found!');
                });
            })
    ],
    forFindingOrdersViaTrackingNumber: [
        check('tracking_number', "Tracking Number is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((tracking_number, { req }) => {
                return ORDERS.findOne({
                    where: {
                        tracking_number,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Orders not found!');
                });
            })
    ],
    forFindingOrdersViaDeliveryStatus: [
        check('delivery_status', "Delivery Status is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
    ],
    forFindingPaidOrders: [
        check('paid', "Paid is required")
            .exists({ checkNull: true, checkFalsy: false })
            .bail()
            .isBoolean()
            .withMessage("Value should be true or false"),
    ],
    forFindingShippedOrders: [
        check('shipped', "Shipped is required")
            .exists({ checkNull: true, checkFalsy: false })
            .bail()
            .isBoolean()
            .withMessage("Value should be true or false"),
    ],
    forFindingDisputedOrders: [
        check('disputed', "Disputed is required")
            .exists({ checkNull: true, checkFalsy: false })
            .bail()
            .isBoolean()
            .withMessage("Value should be true or false"),
    ],
    forFindingOrderFalsy: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return ORDERS.findOne({
                    where: {
                        unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Order not found!');
                });
            })
    ],
    forFindingOrdersViaTrackingNumberFalsy: [
        check('tracking_number', "Tracking Number is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((tracking_number, { req }) => {
                return ORDERS.findOne({
                    where: {
                        tracking_number,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Orders not found!');
                });
            })
    ],
    forFindingOrderAlt: [
        check('order_unique_id', "Order Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(order_unique_id => {
                return ORDERS.findOne({ where: { unique_id: order_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Order not found!');
                });
            })
    ],
    forFindingOrderViaTrackingNumberAlt: [
        check('tracking_number', "Tracking Number is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(tracking_number => {
                return ORDERS.findOne({ where: { tracking_number, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Orders not found!');
                });
            })
    ],
    forAdding: [
        check('product_unique_id', "Product Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((product_unique_id, { req }) => {
                return PRODUCTS.findOne({
                    where: {
                        unique_id: product_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            }),
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity < 1) return false;
                else return true;
            })
            .withMessage("Quantity invalid"),
        check('gateway', "Gateway is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(gateway => !!validate_gateway(gateway)).withMessage(`Invalid gateway, accepts - (${gateways.squad}, ${gateways.paystack}, ${gateways.coinbase} and ${gateways.wallets})`),
        check('payment_method', "Payment Method is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(payment_method => !!validate_payment_method(payment_method)).withMessage(`Invalid payment method, accepted methods (${payment_methods.card}, ${payment_methods.crypto} and ${payment_methods.wallet})`),
        check('contact_fullname', "Contact Fullname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 150 })
            .withMessage("Invalid length (3 - 150) characters"),
        check('contact_email', "Contact Email is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isEmail()
            .withMessage('Invalid email format'),
        check('shipping_firstname', "Shipping Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_lastname', "Shipping Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_address', "Shipping Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('shipping_state', "Shipping State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_city', "Shipping City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_zip_code', "Shipping Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
        check('billing_firstname', "Billing Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_lastname', "Billing Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_address', "Billing Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('billing_state', "Billing State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_city', "Billing City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_zip_code', "Billing Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
    ],
    forAddingViaCartIDs: [
        check('gateway', "Gateway is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(gateway => !!validate_gateway(gateway)).withMessage(`Invalid gateway, accepts - (${gateways.squad}, ${gateways.paystack}, ${gateways.coinbase} and ${gateways.wallets})`),
        check('payment_method', "Payment Method is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(payment_method => !!validate_payment_method(payment_method)).withMessage(`Invalid payment method, accepted methods (${payment_methods.card}, ${payment_methods.crypto} and ${payment_methods.wallet})`),
        check('cart_unique_ids', "Cart Unique IDs are required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isArray({ min: 1 })
            .withMessage("Must be an array of objects (not empty)"), 
        check('contact_fullname', "Contact Fullname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 150 })
            .withMessage("Invalid length (3 - 150) characters"),
        check('contact_email', "Contact Email is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isEmail()
            .withMessage('Invalid email format'),
        check('shipping_firstname', "Shipping Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_lastname', "Shipping Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_address', "Shipping Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('shipping_state', "Shipping State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_city', "Shipping City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_zip_code', "Shipping Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
        check('billing_firstname', "Billing Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_lastname', "Billing Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_address', "Billing Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('billing_state', "Billing State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_city', "Billing City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_zip_code', "Billing Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
    ],
    forAddingViaProducts: [
        check('gateway', "Gateway is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(gateway => !!validate_gateway(gateway)).withMessage(`Invalid gateway, accepts - (${gateways.squad}, ${gateways.paystack}, ${gateways.coinbase} and ${gateways.wallets})`),
        check('payment_method', "Payment Method is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(payment_method => !!validate_payment_method(payment_method)).withMessage(`Invalid payment method, accepted methods (${payment_methods.card}, ${payment_methods.crypto} and ${payment_methods.wallet})`),
        check('products', "Products are required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isArray({ min: 1 })
            .withMessage("Must be an array of objects with values - product_unique_id, quantity (not empty)"), 
        check('contact_fullname', "Contact Fullname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 150 })
            .withMessage("Invalid length (3 - 150) characters"),
        check('contact_email', "Contact Email is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isEmail()
            .withMessage('Invalid email format'),
        check('shipping_firstname', "Shipping Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_lastname', "Shipping Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('shipping_address', "Shipping Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('shipping_state', "Shipping State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_city', "Shipping City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('shipping_zip_code', "Shipping Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
        check('billing_firstname', "Billing Firstname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_lastname', "Billing Lastname is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 50 })
            .withMessage("Invalid length (2 - 50) characters"),
        check('billing_address', "Billing Address is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 500 })
            .withMessage("Invalid length (3 - 500) characters"),
        check('billing_state', "Billing State is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_city', "Billing City is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 50 })
            .withMessage("Invalid length (3 - 50) characters"),
        check('billing_zip_code', "Billing Zip Code is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 15 })
            .withMessage("Invalid length (3 - 15) characters"),
    ],
    forUpdatingQuantity: [
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity < 1) return false;
                else return true;
            })
            .withMessage("Quantity invalid")
    ],
    forUpdatingPaymentMethod: [
        check('payment_method', "Payment Method is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(payment_method => !!validate_payment_method(payment_method)).withMessage(`Invalid payment method, accepted methods (${payment_methods.paypal})`)
    ],  
    forUpdatingGateway: [
        check('gateway', "Gateway is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 20 })
            .withMessage("Invalid length (3 - 20) characters")
            .bail()
            .custom(gateway => !!validate_gateway(gateway)).withMessage(`Invalid gateway, accepts - (${gateways.paypal})`)
    ],
    forDisputingRefund: [
        check('message', "Message is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 1000 })
            .withMessage("Invalid length (3 - 1000) characters")
    ],
    forDenyingRefund: [
        check('feedback', "Feedback is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 1000 })
            .withMessage("Invalid length (3 - 1000) characters")
    ]
};  