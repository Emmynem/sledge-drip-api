import { validationResult, matchedData } from 'express-validator';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import { 
	default_delete_status, default_status, tag_root, true_status, false_status, paginate, return_all_letters_uppercase, random_uuid, paid,
	anonymous, zero, completed, processing, cancelled, refunded, payment_methods, gateways, transaction_types, mailer_url, return_all_letters_lowercase, 
	paystack_verify_payment_url, squad_sandbox_verify_payment_url, squad_live_verify_payment_url, app_defaults, 
} from '../config/config.js';
import db from "../models/index.js";
import { user_order_paid, user_orders_cancelled } from '../config/templates.js';

dotenv.config();

const { cloud_mailer_key, host_type, smtp_host, cloud_mailer_username, cloud_mailer_password, from_email } = process.env;

const TRANSACTIONS = db.transactions;
const ORDERS = db.orders;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const APP_DEFAULTS = db.app_defaults;
const USERS = db.users;
const Op = db.Sequelize.Op;

export async function rootGetTransactions(req, res) {
	const total_records = await TRANSACTIONS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	TRANSACTIONS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: USERS,
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(transactions => {
		if (!transactions || transactions.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Transactions Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Transactions loaded" }, { ...transactions, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetTransaction(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		TRANSACTIONS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.transaction_unique_id,
			},
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
			]
		}).then(transaction => {
			if (!transaction) {
				NotFoundError(res, { unique_id: tag_root, text: "Transaction not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Transaction loaded" }, transaction);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetTransactionsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await TRANSACTIONS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		TRANSACTIONS.findAndCountAll({
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
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(transactions => {
			if (!transactions || transactions.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Transactions Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Transactions loaded" }, { ...transactions, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootFilterTransactions(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await TRANSACTIONS.count({
			where: {
				createdAt: {
					[Op.gte]: timestamp_str_alt(new Date(payload.start_date).setHours(0, 0, 0, 0)),
					[Op.lte]: timestamp_str_alt(new Date(payload.end_date).setHours(23, 59, 59, 0))
				}
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		TRANSACTIONS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				createdAt: {
					[Op.gte]: timestamp_str_alt(new Date(payload.start_date).setHours(0, 0, 0, 0)),
					[Op.lte]: timestamp_str_alt(new Date(payload.end_date).setHours(23, 59, 59, 0))
				}
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(transactions => {
			if (!transactions || transactions.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Transactions Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Transactions loaded" }, { ...transactions, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function getTransactions(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await TRANSACTIONS.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	TRANSACTIONS.findAndCountAll({
		attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
		where: {
			user_unique_id
		},
		order: [
			[orderBy, sortBy]
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(transactions => {
		if (!transactions || transactions.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Transactions Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Transactions loaded" }, { ...transactions, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getTransactionsSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await TRANSACTIONS.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		TRANSACTIONS.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
			where: {
				user_unique_id,
				...payload,
			},
			order: [
				[orderBy, sortBy]
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(transactions => {
			if (!transactions || transactions.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Transactions Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Transactions loaded" }, { ...transactions, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getTransaction(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		TRANSACTIONS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				user_unique_id,
				...payload,
			},
		}).then(transaction => {
			if (!transaction) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Transaction not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Transaction loaded" }, transaction);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function webhookCompleteCryptoPayment(req, res) {
	const payload = req.body;

	const app_default = await APP_DEFAULTS.findOne({
		where: {
			criteria: app_defaults.coinbase_webhook_secret_key,
		}
	});

	if (!app_default) {
		SuccessResponse(res, { unique_id: tag_root, text: "App Default for Coinbase Key not found!" });
	} else {
		const hash = crypto.createHmac('sha512', app_default.value).update(JSON.stringify(payload)).digest('hex');

		if (hash == req.headers['X-CC-WEBHOOK-SIGNATURE']) {
			if (!payload) {
				BadRequestError(res, { unique_id: tag_root, text: "Payload not found!" }, null);
			} else if (!payload.event.data) {
				BadRequestError(res, { unique_id: tag_root, text: "Payload data not found!" }, null);
			} else if (payload.event.type !== "charge:confirmed" && payload.event.type !== "charge:pending") {
				SuccessResponse(res, { unique_id: tag_root, text: "Event is not charge confirmed or pending!" }, null);
			} else if (payload.event.data.timeline.findIndex(e => e.status == "PENDING") < 0 && payload.event.data.timeline.findIndex(e => e.status == "COMPLETED") < 0) {
				BadRequestError(res, { unique_id: tag_root, text: "Event status is not pending or completed!" }, null);
			} else {
				const current_transaction = await TRANSACTIONS.findOne({
					where: {
						payment_method: payment_methods.crypto,
						gateway: gateways.coinbase,
						gateway_reference: payload.event.data.id,
						status: default_status
					}
				});

				if (current_transaction) {
					if (current_transaction.transaction_status !== processing) {
						SuccessResponse(res, { unique_id: tag_root, text: "Transaction not processing" }, null);
					} else {
						try {
							const orders = await ORDERS.findAll({
								attributes: { exclude: ['id'] },
								where: {
									tracking_number: current_transaction.reference
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
										SuccessResponse(res, { unique_id: tag_root, text: "Unable to send email to user" }, null);
									} else {
										await db.sequelize.transaction(async (transaction) => {
											const update_order = await ORDERS.update(
												{
													paid: true_status,
													delivery_status: paid,
												}, {
													where: {
														tracking_number: current_transaction.reference,
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
														reference: current_transaction.reference,
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
									SuccessResponse(res, { unique_id: tag_root, text: mailer_response.data.message }, null);
								}
							} else {
								SuccessResponse(res, { unique_id: tag_root, text: "Orders not found!" }, null);
							}
						} catch (err) {
							ServerError(res, { unique_id: tag_root, text: err.message }, null);
						}
					}
				} else {
					SuccessResponse(res, { unique_id: tag_root, text: "Transaction with gateway reference not found" }, null);
				}
			}
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Signature not verified" }, null);
		}
	}
};

export async function deleteTransaction(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const transactions = await TRANSACTIONS.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (transactions > 0) {
					OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Transaction was deleted successfully!" });
				} else {
					throw new Error("Error deleting transaction");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};