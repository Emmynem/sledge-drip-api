import { validationResult, matchedData } from 'express-validator';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, BadRequestError, logger } from '../common/index.js';
import {
	false_status, true_status, tag_root, paginate, timestamp_str_alt
} from '../config/config.js';
import db from "../models/index.js";

const CATEGORIES = db.categories;
const DISPUTES = db.disputes;
const FAVORITES = db.favorites;
const ORDERS = db.orders;
const PRODUCTS = db.products;
const RATINGS = db.ratings;
const TRANSACTIONS = db.transactions;
const USERS = db.users;
const Op = db.Sequelize.Op;

export async function getAnalytics(req, res) {

	try {
		const total_users = await USERS.count();
		const total_categories = await CATEGORIES.count();
		const total_disputes = await DISPUTES.count();
		const total_favorites = await FAVORITES.count();
		const total_orders = await ORDERS.count();
		const total_products = await PRODUCTS.count();
		const total_ratings = await RATINGS.count();
		const total_transactions = await TRANSACTIONS.count();

		const transactions_amount_sum = await TRANSACTIONS.findAll({
			attributes: [
				[db.sequelize.fn('sum', db.sequelize.col('amount')), 'total_amount'],
			],
		});

		const product_views_sum = await PRODUCTS.findAll({
			attributes: [
				[db.sequelize.fn('sum', db.sequelize.col('views')), 'total_views'],
			],
		});

		const total_orders_via_delivery_status = await ORDERS.findAll({
			attributes: ["delivery_status", [db.sequelize.fn('count', db.sequelize.col('id')), 'total_count']],
			group: "delivery_status"
		});

		const order_amount_sum = await ORDERS.findAll({
			attributes: [
				[db.sequelize.fn('sum', db.sequelize.col('amount')), 'total_amount'],
			],
		});

		const order_shipping_fee_sum = await ORDERS.findAll({
			attributes: [
				[db.sequelize.fn('sum', db.sequelize.col('shipping_fee')), 'total_shipping_fee'],
			],
		});

		const total_order_amount_sum_via_delivery_status = await ORDERS.findAll({
			attributes: ["delivery_status", [db.sequelize.fn('sum', db.sequelize.col('amount')), 'total_amount']],
			group: "delivery_status"
		});

		const total_order_shipping_fee_sum_via_delivery_status = await ORDERS.findAll({
			attributes: ["delivery_status", [db.sequelize.fn('sum', db.sequelize.col('shipping_fee')), 'total_shipping_fee']],
			group: "delivery_status"
		});

		const total_ratings_via_rating = await RATINGS.findAll({
			attributes: ["rating", [db.sequelize.fn('count', db.sequelize.col('id')), 'total_count']],
			group: "rating"
		});

		SuccessResponse(res, { unique_id: tag_root, text: "Analytics Loaded" }, {
			total_users, total_categories, product_views_sum, total_disputes, total_favorites, total_orders, total_products, total_transactions, transactions_amount_sum, total_ratings, 
			total_orders_via_delivery_status, order_amount_sum, order_shipping_fee_sum, total_order_amount_sum_via_delivery_status, total_order_shipping_fee_sum_via_delivery_status, 
			total_ratings_via_rating
		});
	} catch (err) {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	}
};