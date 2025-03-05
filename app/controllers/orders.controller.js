import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import { 
	default_delete_status, default_status, tag_root, true_status, false_status, paginate, random_numbers, cart_checked_out, checked_out, processing, payment_methods, paid,
	payment, completed, refunded, refund, shipping, shipped, refund_denied, currency, disputed, app_defaults, return_all_letters_uppercase, max_product_price_shipping, 
	dummy_product_image, anonymous, cancelled, transaction_types, zero, return_all_letters_lowercase, mailer_url, coinbase_payment_url, coinbase_version, gateways, 
	paystack_verify_payment_url, squad_sandbox_verify_payment_url
} from '../config/config.js';
import db from "../models/index.js";
import { 
	user_order_processing, user_order_completed, user_order_in_transit, user_order_paid, user_order_refund_dispute, user_order_shipped, user_orders_cancelled, user_order_pay,
	user_order_wallet_pay
} from '../config/templates.js';

dotenv.config();

const { cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email } = process.env;

const ORDERS = db.orders;
const TRANSACTIONS = db.transactions;
const DISPUTES = db.disputes;
const APP_DEFAULTS = db.app_defaults;
const USERS = db.users;
const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const Op = db.Sequelize.Op;

export async function rootGetOrders(req, res) {
	const total_records = await ORDERS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	ORDERS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: USERS,
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
			},
			{
				model: PRODUCTS,
				attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
				include: [
					{
						model: PRODUCT_IMAGES,
						attributes: ['image']
					},
					{
						model: CATEGORIES,
						attributes: ['name', 'image', 'stripped']
					},
				]
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(orders => {
		if (!orders || orders.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Orders Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Orders loaded" }, { ...orders, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetOrder(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		ORDERS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.unique_id,
			},
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			]
		}).then(order => {
			if (!order) {
				NotFoundError(res, { unique_id: tag_root, text: "Order not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Order loaded" }, order);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetOrdersSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await ORDERS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		ORDERS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(orders => {
			if (!orders || orders.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Orders Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Orders loaded" }, { ...orders, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function publicGetOrdersSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await ORDERS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		const wallet_addresses_app_default = await APP_DEFAULTS.findAll({
			attributes: ["criteria", "value"],
			where: {
				[Op.or]: [
					{
						criteria: app_defaults.bnb_wallet_address
					},
					{
						criteria: app_defaults.btc_wallet_address
					},
					{
						criteria: app_defaults.eth_wallet_address
					},
					{
						criteria: app_defaults.sol_wallet_address
					},
					{
						criteria: app_defaults.tron_wallet_address
					}
				]
			}
		});

		ORDERS.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
			where: {
				...payload,
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			],
			distinct: true,
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(orders => {
			if (!orders || orders.length == 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Orders Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: anonymous, text: "Orders loaded" }, { ...orders, pages: pagination.pages });
				SuccessResponse(res, { unique_id: anonymous, text: "Orders loaded" }, { ...orders, wallets: wallet_addresses_app_default });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export function publicGetOrder(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		ORDERS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload,
			},
			include: [
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				}
			]
		}).then(order => {
			if (!order) {
				NotFoundError(res, { unique_id: anonymous, text: "Order not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Order loaded" }, order);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicGetWallets(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		APP_DEFAULTS.findAll({
			attributes: ["criteria", "value"],
			where: {
				[Op.or]: [
					{
						criteria: app_defaults.bnb_wallet_address
					},
					{
						criteria: app_defaults.btc_wallet_address
					},
					{
						criteria: app_defaults.eth_wallet_address
					},
					{
						criteria: app_defaults.sol_wallet_address
					},
					{
						criteria: app_defaults.tron_wallet_address
					}
				]
			}
		}).then(wallets => {
			if (!wallets || wallets.length == 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Wallets Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Wallets loaded" }, wallets);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function getOrders(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await ORDERS.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	ORDERS.findAndCountAll({
		attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
		where: {
			user_unique_id
		},
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: PRODUCTS,
				attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
				include: [
					{
						model: PRODUCT_IMAGES,
						attributes: ['image']
					},
					{
						model: CATEGORIES,
						attributes: ['name', 'image', 'stripped']
					},
				]
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(orders => {
		if (!orders || orders.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Orders Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Orders loaded" }, { ...orders, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getOrdersSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await ORDERS.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		ORDERS.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
			where: {
				user_unique_id,
				...payload,
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(orders => {
			if (!orders || orders.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Orders Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Orders loaded" }, { ...orders, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getOrder(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		ORDERS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				user_unique_id,
				...payload,
			},
			include: [
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'image', 'stripped']
						},
					]
				}
			]
		}).then(order => {
			if (!order) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Order not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Order loaded" }, order);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function addOrder(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const app_default = await APP_DEFAULTS.findOne({
				attributes: { exclude: ['id'] },
				where: {
					criteria: app_defaults.minimum_shipping_fee
				}
			});

			if (app_default) {
				const tracking_number = random_numbers(15);
				let total_order_amount = 0;
				let total_cost_amount = 0;
				let total_shipping_amount = 0;
				let all_orders = [];
				let all_mail_orders = [];

				for (let index = 0; index < payload.products.length; index++) {
					const element = payload.products[index];

					const current_product = await PRODUCTS.findOne({
						where: {
							unique_id: element.product_unique_id,
							status: default_status
						}, 
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					});

					if (current_product) {
						const total_quantity = element.quantity;
						const cost = current_product.sales_price === 0 || current_product.sales_price === null ? current_product.price * total_quantity : current_product.sales_price * total_quantity;
						const quantity_even = Math.floor(total_quantity / current_product.max_quantity);

						const shipping_fee = cost > max_product_price_shipping ? ((app_default.value * (cost / max_product_price_shipping)) + (total_quantity > current_product.max_quantity ? app_default.value * quantity_even : zero)) : (total_quantity > current_product.max_quantity ? app_default.value * quantity_even : app_default.value);
					
						const total_cost = cost + shipping_fee;
						total_order_amount += total_cost;
						total_cost_amount += cost;
						total_shipping_amount += shipping_fee;

						all_orders.push({
							unique_id: uuidv4(),
							user_unique_id: user_unique_id,
							product_unique_id: current_product.unique_id,
							tracking_number: tracking_number,
							contact_fullname: payload.contact_fullname,
							contact_email: payload.contact_email,
							shipping_firstname: payload.shipping_firstname,
							shipping_lastname: payload.shipping_lastname,
							shipping_address: payload.shipping_address,
							shipping_state: payload.shipping_state,
							shipping_city: payload.shipping_city,
							shipping_zip_code: payload.shipping_zip_code,
							billing_firstname: payload.billing_firstname,
							billing_lastname: payload.billing_lastname,
							billing_address: payload.billing_address,
							billing_state: payload.billing_state,
							billing_city: payload.billing_city,
							billing_zip_code: payload.billing_zip_code,
							quantity: total_quantity,
							amount: total_cost,
							shipping_fee: shipping_fee,
							gateway: payload.gateway,
							payment_method: payload.payment_method,
							paid: false_status,
							shipped: false_status,
							disputed: false_status,
							delivery_status: processing,
							status: default_status
						}); 

						all_mail_orders.push({
							quantity: total_quantity.toLocaleString(),
							amount: total_cost.toLocaleString(),
							shipping_fee: shipping_fee.toLocaleString(),
							product_name: current_product.name,
							product_image: current_product.product_images.length > 0 ? current_product.product_images[0].image : dummy_product_image
						});

						if (index === payload.products.length - 1) {
							const mail_data = {
								to: payload.contact_email,
								user_name: payload.contact_fullname, 
								tracking_number: tracking_number,
								amount: total_order_amount.toLocaleString(),
								shipping_firstname: payload.shipping_firstname,
								shipping_lastname: payload.shipping_lastname,
								shipping_address: payload.shipping_address,
								shipping_state: payload.shipping_state,
								shipping_city: payload.shipping_city,
								shipping_zip_code: payload.shipping_zip_code,
								billing_firstname: payload.billing_firstname,
								billing_lastname: payload.billing_lastname,
								billing_address: payload.billing_address,
								billing_state: payload.billing_state,
								billing_city: payload.billing_city,
								billing_zip_code: payload.billing_zip_code,
								gateway: payload.gateway,
								payment_method: payload.payment_method,
								delivery_status: processing,
								currency,
								orders: all_mail_orders
							};

							const { email_html, email_subject, email_text } = user_order_processing(mail_data);

							const mailer_response = await axios.post(
								`${mailer_url}/send`,
								{
									host_type: host_type,
									smtp_host: smtp_host,
									username: cloud_mailer_username,
									password: cloud_mailer_password,
									from_email: from_email,
									to_email: return_all_letters_lowercase(mail_data.to),
									subject: email_subject,
									text: email_text,
									html: email_html
								},
								{
									headers: {
										'mailer-access-key': cloud_mailer_key
									}
								}
							);

							if (mailer_response.data.success) {
								if (mailer_response.data.data === null) {
									BadRequestError(res, { unique_id: payload.email, text: "Unable to send email to user" }, null);
								} else {
									await db.sequelize.transaction(async (transaction) => {
										const create_orders = await ORDERS.bulkCreate(all_orders, { transaction });
		
										if (create_orders.length > 0) {
											SuccessResponse(res, { unique_id: user_unique_id, text: "Orders created successfully!" }, { tracking_number, amount: total_order_amount, currency, total_cost_amount, total_shipping_amount, mail_data });
										} else {
											throw new Error("Error adding creating orders");
										}
									});
								}
							} else {
								BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
							}
						}
					} else {
						throw new Error("Error getting product details");
					}
				}
			} else {
				BadRequestError(res, { unique_id: user_unique_id, text: "App Default for Shipping Fee not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function addExternalOrder(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const app_default = await APP_DEFAULTS.findOne({
				attributes: { exclude: ['id'] },
				where: {
					criteria: app_defaults.minimum_shipping_fee
				}
			});

			if (app_default) {
				const tracking_number = random_numbers(15);
				let total_order_amount = 0;
				let total_cost_amount = 0;
				let total_shipping_amount = 0;
				let all_orders = [];
				let all_mail_orders = [];

				for (let index = 0; index < payload.products.length; index++) {
					const element = payload.products[index];

					const current_product = await PRODUCTS.findOne({
						where: {
							unique_id: element.product_unique_id,
							status: default_status
						}, 
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					});

					if (current_product) {
						const total_quantity = parseInt(element.quantity);
						const cost = parseInt(current_product.sales_price) === 0 || current_product.sales_price === null ? parseInt(current_product.price) * total_quantity : parseInt(current_product.sales_price) * total_quantity;
						const quantity_even = Math.floor(total_quantity / parseInt(current_product.max_quantity));

						const shipping_fee = cost > max_product_price_shipping ? ((parseInt(app_default.value) * (cost / max_product_price_shipping)) + (total_quantity > parseInt(current_product.max_quantity) ? parseInt(app_default.value) * quantity_even : zero)) : (total_quantity > parseInt(current_product.max_quantity) ? parseInt(app_default.value) * quantity_even : parseInt(app_default.value));
					
						const total_cost = cost + shipping_fee;
						total_order_amount += total_cost;
						total_cost_amount += cost;
						total_shipping_amount += shipping_fee;

						all_orders.push({
							unique_id: uuidv4(),
							user_unique_id: null,
							product_unique_id: current_product.unique_id,
							tracking_number: tracking_number,
							gateway_reference: null,
							contact_fullname: payload.contact_fullname,
							contact_email: payload.contact_email,
							shipping_firstname: payload.shipping_firstname,
							shipping_lastname: payload.shipping_lastname,
							shipping_address: payload.shipping_address,
							shipping_state: payload.shipping_state,
							shipping_city: payload.shipping_city,
							shipping_zip_code: payload.shipping_zip_code,
							billing_firstname: payload.billing_firstname,
							billing_lastname: payload.billing_lastname,
							billing_address: payload.billing_address,
							billing_state: payload.billing_state,
							billing_city: payload.billing_city,
							billing_zip_code: payload.billing_zip_code,
							quantity: total_quantity,
							amount: total_cost,
							shipping_fee: shipping_fee,
							gateway: payload.gateway,
							payment_method: payload.payment_method,
							paid: false_status,
							shipped: false_status,
							disputed: false_status,
							delivery_status: processing,
							status: default_status
						}); 

						all_mail_orders.push({
							quantity: total_quantity.toLocaleString(),
							amount: total_cost.toLocaleString(),
							shipping_fee: shipping_fee.toLocaleString(),
							product_name: current_product.name,
							product_image: current_product.product_images.length > 0 ? current_product.product_images[0].image : dummy_product_image
						});

						if (index === payload.products.length - 1) {
							const mail_data = {
								to: payload.contact_email,
								user_name: payload.contact_fullname, 
								tracking_number: tracking_number,
								amount: total_order_amount.toLocaleString(),
								shipping_firstname: payload.shipping_firstname,
								shipping_lastname: payload.shipping_lastname,
								shipping_address: payload.shipping_address,
								shipping_state: payload.shipping_state,
								shipping_city: payload.shipping_city,
								shipping_zip_code: payload.shipping_zip_code,
								billing_firstname: payload.billing_firstname,
								billing_lastname: payload.billing_lastname,
								billing_address: payload.billing_address,
								billing_state: payload.billing_state,
								billing_city: payload.billing_city,
								billing_zip_code: payload.billing_zip_code,
								gateway: payload.gateway,
								payment_method: payload.payment_method,
								delivery_status: processing,
								currency,
								orders: all_mail_orders
							};

							const { email_html, email_subject, email_text } = user_order_processing(mail_data);

							const mailer_response = await axios.post(
								`${mailer_url}/send`,
								{
									host_type: host_type,
									smtp_host: smtp_host,
									username: cloud_mailer_username,
									password: cloud_mailer_password,
									from_email: from_email,
									to_email: return_all_letters_lowercase(mail_data.to),
									subject: email_subject,
									text: email_text,
									html: email_html
								},
								{
									headers: {
										'mailer-access-key': cloud_mailer_key
									}
								}
							);

							if (mailer_response.data.success) {
								if (mailer_response.data.data === null) {
									BadRequestError(res, { unique_id: payload.email, text: "Unable to send email to user" }, null);
								} else {
									await db.sequelize.transaction(async (transaction) => {
										const create_orders = await ORDERS.bulkCreate(all_orders, { transaction });
		
										if (create_orders.length > 0) {
											SuccessResponse(res, { unique_id: anonymous, text: "Orders created successfully!" }, { tracking_number, amount: total_order_amount, currency, total_cost_amount, total_shipping_amount });
										} else {
											throw new Error("Error adding creating orders");
										}
									});
								}
							} else {
								BadRequestError(res, { unique_id: payload.email, text: mailer_response.data.message }, null);
							}
						}
					} else {
						throw new Error("Error getting product details");
					}
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "App Default for Shipping Fee not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function initiateCryptoPayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const coinbase_api_key_app_default = await APP_DEFAULTS.findOne({
				attributes: { exclude: ['id'] },
				where: {
					criteria: app_defaults.coinbase_api_key
				}
			});

			if (coinbase_api_key_app_default) {
				const orders = await ORDERS.findAll({
					attributes: { exclude: ['id'] },
					where: {
						tracking_number: payload.tracking_number
					},
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								},
							]
						},
					],
				});

				if (orders && orders.length > 0) {
					let initialValue = 0;

					let total_order_amount = orders.reduce(function (accumulator, curValue) {

						return accumulator + curValue.amount

					}, initialValue);

					const all_mail_orders = orders.flatMap((e) => {
						return {
							quantity: e.quantity.toLocaleString(),
							amount: e.amount.toLocaleString(),
							shipping_fee: e.shipping_fee.toLocaleString(),
							product_name: e.product.name,
							product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
						}
					});

					const mail_data = {
						to: orders[0].contact_email,
						user_name: orders[0].contact_fullname,
						tracking_number: orders[0].tracking_number,
						amount: total_order_amount.toLocaleString(),
						shipping_firstname: orders[0].shipping_firstname,
						shipping_lastname: orders[0].shipping_lastname,
						shipping_address: orders[0].shipping_address,
						shipping_state: orders[0].shipping_state,
						shipping_city: orders[0].shipping_city,
						shipping_zip_code: orders[0].shipping_zip_code,
						billing_firstname: orders[0].billing_firstname,
						billing_lastname: orders[0].billing_lastname,
						billing_address: orders[0].billing_address,
						billing_state: orders[0].billing_state,
						billing_city: orders[0].billing_city,
						billing_zip_code: orders[0].billing_zip_code,
						gateway: orders[0].gateway,
						payment_method: orders[0].payment_method,
						delivery_status: processing,
						currency,
						orders: all_mail_orders
					};

					const coinbase_payment_response = await axios.post(
						`${coinbase_payment_url}`,
						{
							pricing_type: "fixed_price",
							local_price: {
								amount: total_order_amount.toString(),
								currency: currency
							},
							metadata: {
								name: orders[0].contact_fullname,
								description: `Payment for order(s) - ${payload.tracking_number}`,
								tracking_number: payload.tracking_number
							}
						},
						{
							headers: {
								'X-CC-Api-Key': coinbase_api_key_app_default.value, 
								'X-CC-Version': coinbase_version
							}
						}
					);

					if (coinbase_payment_response.status == 201) {
						const coinbase_payment_id = coinbase_payment_response.data.data.id;
						const coinbase_payment_hosted_url = coinbase_payment_response.data.data.hosted_url;

						const { email_html, email_subject, email_text } = user_order_pay({ ...mail_data, coinbase_payment_hosted_url });

						const mailer_response = await axios.post(
							`${mailer_url}/send`,
							{
								host_type: host_type,
								smtp_host: smtp_host,
								username: cloud_mailer_username,
								password: cloud_mailer_password,
								from_email: from_email,
								to_email: return_all_letters_lowercase(mail_data.to),
								subject: email_subject,
								text: email_text,
								html: email_html
							},
							{
								headers: {
									'mailer-access-key': cloud_mailer_key
								}
							}
						);

						if (mailer_response.data.success) {
							if (mailer_response.data.data === null) {
								BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
							} else {
								await db.sequelize.transaction(async (transaction) => {
									const update_order = await ORDERS.update(
										{
											gateway_reference: coinbase_payment_id,
										}, {
											where: {
												tracking_number: payload.tracking_number,
												status: default_status
											},
											transaction
										}
									);
			
									const transactions = await TRANSACTIONS.create(
										{
											unique_id: uuidv4(),
											user_unique_id: null,
											type: transaction_types.payment,
											gateway: orders[0].gateway,
											payment_method: orders[0].payment_method,
											currency,
											amount: total_order_amount,
											reference: payload.tracking_number,
											gateway_reference: coinbase_payment_id,
											transaction_status: processing,
											details: coinbase_payment_hosted_url,
											status: default_status
										}, { transaction }
									);
		
									if (update_order > 0 && transactions) {
										SuccessResponse(res, { unique_id: orders[0].contact_email, text: "Payment initiated successfully!" }, { tracking_number: payload.tracking_number, coinbase_payment_hosted_url, coinbase_payment_id, amount: total_order_amount, currency });
									} else {
										throw new Error("Error creating transaction");
									}
								});
							}
						} else {
							BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
						}
					} else {
						BadRequestError(res, { unique_id: anonymous, text: "Unable to initiate payment charge" }, null);
					}
				} else {
					BadRequestError(res, { unique_id: anonymous, text: "Orders not found!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "App Default for Payment not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function initiateWalletPayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const wallet_addresses_app_default = await APP_DEFAULTS.findAll({
				attributes: ["criteria", "value"],
				where: {
					[Op.or]: [
						{
							criteria: app_defaults.bnb_wallet_address
						},
						{
							criteria: app_defaults.btc_wallet_address
						},
						{
							criteria: app_defaults.eth_wallet_address
						},
						{
							criteria: app_defaults.sol_wallet_address
						},
						{
							criteria: app_defaults.tron_wallet_address
						}
					]
				}
			});

			if (wallet_addresses_app_default) {
				const orders = await ORDERS.findAll({
					attributes: { exclude: ['id'] },
					where: {
						tracking_number: payload.tracking_number
					},
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								},
							]
						},
					],
				});

				if (orders && orders.length > 0) {
					let initialValue = 0;

					let total_order_amount = orders.reduce(function (accumulator, curValue) {

						return accumulator + curValue.amount

					}, initialValue);

					const all_mail_orders = orders.flatMap((e) => {
						return {
							quantity: e.quantity.toLocaleString(),
							amount: e.amount.toLocaleString(),
							shipping_fee: e.shipping_fee.toLocaleString(),
							product_name: e.product.name,
							product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
						}
					});

					const mail_data = {
						to: orders[0].contact_email,
						user_name: orders[0].contact_fullname,
						tracking_number: orders[0].tracking_number,
						amount: total_order_amount.toLocaleString(),
						shipping_firstname: orders[0].shipping_firstname,
						shipping_lastname: orders[0].shipping_lastname,
						shipping_address: orders[0].shipping_address,
						shipping_state: orders[0].shipping_state,
						shipping_city: orders[0].shipping_city,
						shipping_zip_code: orders[0].shipping_zip_code,
						billing_firstname: orders[0].billing_firstname,
						billing_lastname: orders[0].billing_lastname,
						billing_address: orders[0].billing_address,
						billing_state: orders[0].billing_state,
						billing_city: orders[0].billing_city,
						billing_zip_code: orders[0].billing_zip_code,
						gateway: orders[0].gateway,
						payment_method: orders[0].payment_method,
						delivery_status: processing,
						currency,
						orders: all_mail_orders
					};

					const { email_html, email_subject, email_text } = user_order_wallet_pay(mail_data);

					const mailer_response = await axios.post(
						`${mailer_url}/send`,
						{
							host_type: host_type,
							smtp_host: smtp_host,
							username: cloud_mailer_username,
							password: cloud_mailer_password,
							from_email: from_email,
							to_email: return_all_letters_lowercase(mail_data.to),
							subject: email_subject,
							text: email_text,
							html: email_html
						},
						{
							headers: {
								'mailer-access-key': cloud_mailer_key
							}
						}
					);

					if (mailer_response.data.success) {
						if (mailer_response.data.data === null) {
							BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
						} else {
							await db.sequelize.transaction(async (transaction) => {
								const transactions = await TRANSACTIONS.create(
									{
										unique_id: uuidv4(),
										user_unique_id: null,
										type: transaction_types.payment,
										gateway: orders[0].gateway,
										payment_method: orders[0].payment_method,
										currency,
										amount: total_order_amount,
										reference: payload.tracking_number,
										gateway_reference: null,
										transaction_status: processing,
										details: null,
										status: default_status
									}, { transaction }
								);

								if (transactions) {
									SuccessResponse(res, { unique_id: orders[0].contact_email, text: "Payment initiated successfully!" }, { tracking_number: payload.tracking_number, amount: total_order_amount, currency, wallets: wallet_addresses_app_default });
								} else {
									throw new Error("Error creating transaction");
								}
							});
						}
					} else {
						BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
					}
				} else {
					BadRequestError(res, { unique_id: anonymous, text: "Orders not found!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "App Default for Payment not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function initiateNairaPayment(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				},
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => {
					return {
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					}
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: processing,
					currency,
					orders: all_mail_orders
				};

				const { email_html, email_subject, email_text } = user_order_wallet_pay(mail_data);

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(mail_data.to),
						subject: email_subject,
						text: email_text,
						html: email_html
					},
					{
						headers: {
							'mailer-access-key': cloud_mailer_key
						}
					}
				);

				if (mailer_response.data.success) {
					if (mailer_response.data.data === null) {
						BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
					} else {
						const details = `NGN ${total_order_amount.toLocaleString()} ${transaction_types.payment.toLowerCase()}, via ${orders[0].payment_method} - ${orders[0].gateway} for orders, tracking number ${payload.tracking_number}`;

						await db.sequelize.transaction(async (transaction) => {
							const transactions = await TRANSACTIONS.create(
								{
									unique_id: uuidv4(),
									user_unique_id: null,
									type: transaction_types.payment,
									gateway: orders[0].gateway,
									payment_method: orders[0].payment_method,
									currency,
									amount: total_order_amount,
									reference: payload.tracking_number,
									gateway_reference: null,
									transaction_status: processing,
									details,
									status: default_status
								}, { transaction }
							);

							if (transactions) {
								SuccessResponse(res, { unique_id: orders[0].contact_email, text: "Payment initiated successfully!" }, { tracking_number: payload.tracking_number, amount: total_order_amount, currency });
							} else {
								throw new Error("Error creating transaction");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function updateOrderPaid(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				}, 
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => { 
					return { 
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					} 
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: paid,
					currency, 
					orders: all_mail_orders
				};

				if (orders[0].payment_method === payment_methods.card) {
					if (orders[0].gateway === gateways.paystack) {
						const app_default = await APP_DEFAULTS.findOne({
							attributes: { exclude: ['id'] },
							where: {
								criteria: app_defaults.paystack_secret_key
							}
						});

						if (app_default) {
							try {
								const paystack_transaction_res = await axios.get(
									`${paystack_verify_payment_url}${orders[0].tracking_number}`,
									{
										headers: {
											'Authorization': `Bearer ${app_default.value}`
										}
									}
								);

								if (paystack_transaction_res.data.status !== true) {
									BadRequestError(res, { unique_id: tag_root, text: "Error getting payment for validation" }, null);
								} else if (paystack_transaction_res.data.data.status !== "success") {
									BadRequestError(res, { unique_id: tag_root, text: `Payment unsuccessful (Status - ${return_all_letters_uppercase(paystack_transaction_res.data.data.status)})` }, null);
								} else {
									const { email_html, email_subject, email_text } = user_order_paid(mail_data);

									const mailer_response = await axios.post(
										`${mailer_url}/send`,
										{
											host_type: host_type,
											smtp_host: smtp_host,
											username: cloud_mailer_username,
											password: cloud_mailer_password,
											from_email: from_email,
											to_email: return_all_letters_lowercase(mail_data.to),
											subject: email_subject,
											text: email_text,
											html: email_html
										},
										{
											headers: {
												'mailer-access-key': cloud_mailer_key
											}
										}
									);

									if (mailer_response.data.success) {
										if (mailer_response.data.data === null) {
											BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
										} else {
											await db.sequelize.transaction(async (transaction) => {
												const update_order = await ORDERS.update(
													{
														paid: true_status,
														delivery_status: paid,
													}, {
														where: {
															tracking_number: payload.tracking_number,
															status: default_status
														},
														transaction
													}
												);

												const update_transaction = await TRANSACTIONS.update(
													{
														transaction_status: completed,
													}, {
														where: {
															reference: payload.tracking_number,
															status: default_status
														},
														transaction
													}
												);

												if (update_order > 0 && update_transaction > 0) {
													SuccessResponse(res, { unique_id: tag_root, text: "Orders paid successfully!" }, null);
												} else {
													throw new Error("Orders not found");
												}
											});
										}
									} else {
										BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
									}
								}
							} catch (error) {
								BadRequestError(res, { unique_id: tag_root, text: error.response ? error.response.data.message : error.message }, { err_code: error.code });
							}
						} else {
							BadRequestError(res, { unique_id: tag_root, text: "App Default for Paystack Gateway not found!" }, null);
						}
					} else if (orders[0].gateway === gateways.squad) {
						const app_default = await APP_DEFAULTS.findOne({
							attributes: { exclude: ['id'] },
							where: {
								criteria: app_defaults.squad_secret_key
							}
						});

						if (app_default) {
							try {
								const squad_transaction_res = await axios.get(
									`${squad_sandbox_verify_payment_url}${orders[0].tracking_number}`,
									{
										headers: {
											'Authorization': `Bearer ${app_default.value}`
										}
									}
								);

								if (squad_transaction_res.data.success !== true) {
									BadRequestError(res, { unique_id: tag_root, text: "Error getting payment for validation" }, null);
								} else if (squad_transaction_res.data.data.transaction_status !== "success") {
									BadRequestError(res, { unique_id: tag_root, text: `Payment unsuccessful (Status - ${squad_transaction_res.data.data.transaction_status})` }, null);
								}
								// else if (squad_transaction_res.data.data.transaction_amount < current_payments.amount) {
								// 	BadRequestError(res, { unique_id: tag_root, text: `Invalid transaction amount!` }, null);
								// } 
								else {
									const { email_html, email_subject, email_text } = user_order_paid(mail_data);

									const mailer_response = await axios.post(
										`${mailer_url}/send`,
										{
											host_type: host_type,
											smtp_host: smtp_host,
											username: cloud_mailer_username,
											password: cloud_mailer_password,
											from_email: from_email,
											to_email: return_all_letters_lowercase(mail_data.to),
											subject: email_subject,
											text: email_text,
											html: email_html
										},
										{
											headers: {
												'mailer-access-key': cloud_mailer_key
											}
										}
									);

									if (mailer_response.data.success) {
										if (mailer_response.data.data === null) {
											BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
										} else {
											await db.sequelize.transaction(async (transaction) => {
												const update_order = await ORDERS.update(
													{
														paid: true_status,
														delivery_status: paid,
													}, {
														where: {
															tracking_number: payload.tracking_number,
															status: default_status
														},
														transaction
													}
												);

												const update_transaction = await TRANSACTIONS.update(
													{
														transaction_status: completed,
													}, {
														where: {
															reference: payload.tracking_number,
															status: default_status
														},
														transaction
													}
												);

												if (update_order > 0 && update_transaction > 0) {
													SuccessResponse(res, { unique_id: tag_root, text: "Orders paid successfully!" }, null);
												} else {
													throw new Error("Orders not found");
												}
											});
										}
									} else {
										BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
									}
								}
							} catch (error) {
								BadRequestError(res, { unique_id: tag_root, text: error.response ? error.response.data.message : error.message }, { err_code: error.code });
							}
						} else {
							BadRequestError(res, { unique_id: tag_root, text: "App Default for Squad Gateway not found!" }, null);
						}
					} else {
						BadRequestError(res, { unique_id: tag_root, text: "Invalid transaction gateway!" }, null);
					}
				} else {
					const { email_html, email_subject, email_text } = user_order_paid(mail_data);
	
					const mailer_response = await axios.post(
						`${mailer_url}/send`,
						{
							host_type: host_type,
							smtp_host: smtp_host,
							username: cloud_mailer_username,
							password: cloud_mailer_password,
							from_email: from_email,
							to_email: return_all_letters_lowercase(mail_data.to),
							subject: email_subject,
							text: email_text,
							html: email_html
						},
						{
							headers: {
								'mailer-access-key': cloud_mailer_key
							}
						}
					);
	
					if (mailer_response.data.success) {
						if (mailer_response.data.data === null) {
							BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
						} else {
							await db.sequelize.transaction(async (transaction) => {
								const update_order = await ORDERS.update(
									{
										paid: true_status,
										delivery_status: paid,
									}, {
										where: {
											tracking_number: payload.tracking_number,
											status: default_status
										},
										transaction
									}
								);
	
								const update_transaction = await TRANSACTIONS.update(
									{
										transaction_status: completed,
									}, {
										where: {
											reference: payload.tracking_number,
											status: default_status
										},
										transaction
									}
								);
			
								if (update_order > 0 && update_transaction > 0) {
									SuccessResponse(res, { unique_id: tag_root, text: "Orders paid successfully!" }, null);
								} else {
									throw new Error("Orders not found");
								}
							});
						}
					} else {
						BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
					}
				}
			} else {
				BadRequestError(res, { unique_id: tag_root, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateOrderCancelled(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				}, 
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => { 
					return { 
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					} 
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: cancelled,
					currency, 
					orders: all_mail_orders
				};

				const { email_html, email_subject, email_text } = user_orders_cancelled(mail_data);

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(mail_data.to),
						subject: email_subject,
						text: email_text,
						html: email_html
					},
					{
						headers: {
							'mailer-access-key': cloud_mailer_key
						}
					}
				);

				if (mailer_response.data.success) {
					if (mailer_response.data.data === null) {
						BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
					} else {
						await db.sequelize.transaction(async (transaction) => {
							const update_order = await ORDERS.update(
								{
									delivery_status: cancelled,
								}, {
									where: {
										tracking_number: payload.tracking_number,
										status: default_status
									},
									transaction
								}
							);
		
							if (update_order > 0) {
								SuccessResponse(res, { unique_id: tag_root, text: "Orders cancelled successfully!" }, null);
							} else {
								throw new Error("Orders not found");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			} else {
				BadRequestError(res, { unique_id: tag_root, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateOrderInTransit(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				},
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => {
					return {
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					}
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: shipping,
					currency,
					orders: all_mail_orders
				};

				const { email_html, email_subject, email_text } = user_order_in_transit(mail_data);

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(mail_data.to),
						subject: email_subject,
						text: email_text,
						html: email_html
					},
					{
						headers: {
							'mailer-access-key': cloud_mailer_key
						}
					}
				);

				if (mailer_response.data.success) {
					if (mailer_response.data.data === null) {
						BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
					} else {
						await db.sequelize.transaction(async (transaction) => {
							const update_order = await ORDERS.update(
								{
									shipping: true_status,
									delivery_status: shipping,
								}, {
									where: {
										tracking_number: payload.tracking_number,
										status: default_status
									},
									transaction
								}
							);
		
							if (update_order > 0) {
								SuccessResponse(res, { unique_id: tag_root, text: "Orders shipping successfully!" }, null);
							} else {
								throw new Error("Orders not found");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			} else {
				BadRequestError(res, { unique_id: tag_root, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateOrderShipped(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				},
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => {
					return {
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					}
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: shipped,
					currency,
					orders: all_mail_orders
				};

				const { email_html, email_subject, email_text } = user_order_shipped(mail_data);

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(mail_data.to),
						subject: email_subject,
						text: email_text,
						html: email_html
					},
					{
						headers: {
							'mailer-access-key': cloud_mailer_key
						}
					}
				);

				if (mailer_response.data.success) {
					if (mailer_response.data.data === null) {
						BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
					} else {
						await db.sequelize.transaction(async (transaction) => {
							const update_order = await ORDERS.update(
								{
									shipped: true_status,
									delivery_status: shipped,
								}, {
									where: {
										tracking_number: payload.tracking_number,
										status: default_status
									},
									transaction
								}
							);
		
							if (update_order > 0) {
								SuccessResponse(res, { unique_id: tag_root, text: "Orders shipped successfully!" }, null);
							} else {
								throw new Error("Orders not found");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			} else {
				BadRequestError(res, { unique_id: tag_root, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateOrderCompleted(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const orders = await ORDERS.findAll({
				attributes: { exclude: ['id'] },
				where: {
					tracking_number: payload.tracking_number
				},
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							},
						]
					},
				],
			});

			if (orders && orders.length > 0) {
				let initialValue = 0;

				let total_order_amount = orders.reduce(function (accumulator, curValue) {

					return accumulator + curValue.amount

				}, initialValue);

				const all_mail_orders = orders.flatMap((e) => {
					return {
						quantity: e.quantity.toLocaleString(),
						amount: e.amount.toLocaleString(),
						shipping_fee: e.shipping_fee.toLocaleString(),
						product_name: e.product.name,
						product_image: e.product.product_images.length > 0 ? e.product.product_images[0].image : dummy_product_image,
					}
				});

				const mail_data = {
					to: orders[0].contact_email,
					user_name: orders[0].contact_fullname,
					tracking_number: orders[0].tracking_number,
					amount: total_order_amount.toLocaleString(),
					shipping_firstname: orders[0].shipping_firstname,
					shipping_lastname: orders[0].shipping_lastname,
					shipping_address: orders[0].shipping_address,
					shipping_state: orders[0].shipping_state,
					shipping_city: orders[0].shipping_city,
					shipping_zip_code: orders[0].shipping_zip_code,
					billing_firstname: orders[0].billing_firstname,
					billing_lastname: orders[0].billing_lastname,
					billing_address: orders[0].billing_address,
					billing_state: orders[0].billing_state,
					billing_city: orders[0].billing_city,
					billing_zip_code: orders[0].billing_zip_code,
					gateway: orders[0].gateway,
					payment_method: orders[0].payment_method,
					delivery_status: completed,
					currency,
					orders: all_mail_orders
				};

				const { email_html, email_subject, email_text } = user_order_completed(mail_data);

				const mailer_response = await axios.post(
					`${mailer_url}/send`,
					{
						host_type: host_type,
						smtp_host: smtp_host,
						username: cloud_mailer_username,
						password: cloud_mailer_password,
						from_email: from_email,
						to_email: return_all_letters_lowercase(mail_data.to),
						subject: email_subject,
						text: email_text,
						html: email_html
					},
					{
						headers: {
							'mailer-access-key': cloud_mailer_key
						}
					}
				);

				if (mailer_response.data.success) {
					if (mailer_response.data.data === null) {
						BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
					} else {
						await db.sequelize.transaction(async (transaction) => {
							const update_order = await ORDERS.update(
								{
									delivery_status: completed,
								}, {
									where: {
										tracking_number: payload.tracking_number,
										status: default_status
									},
									transaction
								}
							);
		
							if (update_order > 0) {
								// SuccessResponse(res, { unique_id: tag_root, text: "Orders shipped successfully!" }, null);
								SuccessResponse(res, { unique_id: tag_root, text: "Orders shipped successfully!" }, { mail_data });
							} else {
								throw new Error("Orders not found");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
				}
			} else {
				BadRequestError(res, { unique_id: tag_root, text: "Orders not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function disputeOrderForRefund(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const order = await ORDERS.findOne({
				attributes: { exclude: ['id'] },
				where: {
					unique_id: payload.unique_id,
					disputed: false_status
				}
			});

			if (order) {
				if (!order.paid && !order.shipped && order.delivery_status !== completed) {
					BadRequestError(res, { unique_id: anonymous, text: "Order hasn't been completed!" }, null);
				} else {
					const combined_message = `Order is been disputed for a refund. Customer's reason - ${!payload.message ? "None" : payload.message}`;

					const mail_data = {
						to: order.contact_email,
						user_name: order.contact_fullname,
						tracking_number: order.tracking_number,
						order_unique_id: payload.unique_id,
					};

					const { email_html, email_subject, email_text } = user_order_refund_dispute(mail_data);

					const mailer_response = await axios.post(
						`${mailer_url}/send`,
						{
							host_type: host_type,
							smtp_host: smtp_host,
							username: cloud_mailer_username,
							password: cloud_mailer_password,
							from_email: from_email,
							to_email: return_all_letters_lowercase(mail_data.to),
							subject: email_subject,
							text: email_text,
							html: email_html
						},
						{
							headers: {
								'mailer-access-key': cloud_mailer_key
							}
						}
					);

					if (mailer_response.data.success) {
						if (mailer_response.data.data === null) {
							BadRequestError(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
						} else {
							await db.sequelize.transaction(async (transaction) => {
								const update_order = await ORDERS.update(
									{
										disputed: true_status,
										delivery_status: refund
									}, {
										where: {
											unique_id: payload.unique_id,
											status: default_status
										},
										transaction
									}
								);
		
								const disputes = await DISPUTES.create(
									{
										unique_id: uuidv4(),
										user_unique_id: null,
										order_unique_id: payload.unique_id,
										message: combined_message,
										status: default_status
									}, { transaction }
								);
				
								if (update_order > 0 && disputes) {
									SuccessResponse(res, { unique_id: anonymous, text: "Order disputed successfully!" }, null);
								} else {
									throw new Error("Unable to dispute order");
								}
							});
						}
					} else {
						BadRequestError(res, { unique_id: anonymous, text: mailer_response.data.message }, null);
					}
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "Order not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};
