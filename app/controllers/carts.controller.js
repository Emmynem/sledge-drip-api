import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import { default_delete_status, default_status, tag_root, true_status, false_status, paginate, app_defaults, max_product_price_shipping, zero, return_all_letters_uppercase, anonymous } from '../config/config.js';
import db from "../models/index.js";

const APP_DEFAULTS = db.app_defaults;
const CARTS = db.carts;
const USERS = db.users;
const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const Op = db.Sequelize.Op;

export async function rootGetCarts(req, res) {
	const total_records = await CARTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	CARTS.findAndCountAll({
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
				attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
				include: [
					{
						model: PRODUCT_IMAGES,
						attributes: ['image']
					},
					{
						model: CATEGORIES,
						attributes: ['name', 'stripped']
					},
				]
			},
		],
		offset: pagination.start,
		limit: pagination.limit
	}).then(carts => {
		if (!carts || carts.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Carts Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Carts loaded" }, { ...carts, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetCart(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		CARTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.cart_unique_id,
			},
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'stripped']
						},
					]
				},
			]
		}).then(cart => {
			if (!cart) {
				NotFoundError(res, { unique_id: tag_root, text: "Cart not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Cart loaded" }, cart);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetCartsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await CARTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		CARTS.findAndCountAll({
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
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'stripped']
						},
					]
				},
			],
			offset: pagination.start,
			limit: pagination.limit
		}).then(carts => {
			if (!carts || carts.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Carts Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Carts loaded" }, { ...carts, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function getCarts(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await CARTS.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	CARTS.findAndCountAll({
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
				attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
				include: [
					{
						model: PRODUCT_IMAGES,
						attributes: ['image']
					},
					{
						model: CATEGORIES,
						attributes: ['name', 'stripped']
					},
				]
			},
		],
		offset: pagination.start,
		limit: pagination.limit
	}).then(carts => {
		if (!carts || carts.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Carts Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Carts loaded" }, { ...carts, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getCartsSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await CARTS.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		CARTS.findAndCountAll({
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
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'stripped']
						},
					]
				},
			],
			offset: pagination.start,
			limit: pagination.limit
		}).then(carts => {
			if (!carts || carts.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Carts Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Carts loaded" }, { ...carts, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getCart(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		CARTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				user_unique_id,
				...payload,
			},
			include: [
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'price', 'sales_price', 'views', 'favorites'],
					include: [
						{
							model: PRODUCT_IMAGES,
							attributes: ['image']
						},
						{
							model: CATEGORIES,
							attributes: ['name', 'stripped']
						},
					]
				}
			]
		}).then(cart => {
			if (!cart) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Cart not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Cart loaded" }, cart);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function addCart(req, res) {
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
				const product = await PRODUCTS.findOne({
					where: {
						unique_id: payload.product_unique_id,
						status: default_status
					}
				});

				const existing_cart = await CARTS.findOne({
					where: {
						user_unique_id,
						product_unique_id: payload.product_unique_id,
						status: default_status
					}
				});

				const total_quantity = existing_cart ? existing_cart.quantity + payload.quantity : payload.quantity;
				const cost = product.sales_price === 0 || product.sales_price === null ? product.price : product.sales_price;
				const quantity_even = Math.floor(total_quantity / product.max_quantity);
				
				const shipping_fee = cost > max_product_price_shipping ? ((app_default.value * (cost / max_product_price_shipping)) + (total_quantity > product.max_quantity ? app_default.value * quantity_even : zero)) : (total_quantity > product.max_quantity ? app_default.value * quantity_even : app_default.value);

				if (product.remaining >= total_quantity) {
					if (existing_cart) {
						await db.sequelize.transaction(async (transaction) => {
							const cart = await CARTS.update(
								{
									quantity: total_quantity,
									shipping_fee: shipping_fee
								}, {
									where: {
										user_unique_id,
										product_unique_id: payload.product_unique_id,
										status: default_status
									},
									transaction
								}
							);
	
							if (cart > 0) {
								OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Cart updated successfully!" });
							} else {
								throw new Error("Error updating cart!");
							}
						});
					} else {
						await db.sequelize.transaction(async (transaction) => {
							const carts = await CARTS.create(
								{
									unique_id: uuidv4(),
									user_unique_id,
									...payload,
									shipping_fee: shipping_fee,
									status: default_status
								}, { transaction }
							);
	
							if (carts) {
								SuccessResponse(res, { unique_id: user_unique_id, text: "Cart added successfully!" });
							} else {
								throw new Error("Error adding cart!");
							}
						});
					}
				} else {
					BadRequestError(res, { unique_id: user_unique_id, text: "Product is out of stock!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: user_unique_id, text: "App Default for Shipping Fee not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function addExternalCart(req, res) {
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
				const product = await PRODUCTS.findOne({
					where: {
						unique_id: payload.product_unique_id,
						status: default_status
					}
				});

				const total_quantity = payload.quantity;
				const cost = product.sales_price === 0 || product.sales_price === null ? product.price : product.sales_price;
				const quantity_even = Math.floor(total_quantity / product.max_quantity);
				
				const shipping_fee = cost > max_product_price_shipping ? ((app_default.value * (cost / max_product_price_shipping)) + (total_quantity > product.max_quantity ? app_default.value * quantity_even : zero)) : (total_quantity > product.max_quantity ? app_default.value * quantity_even : app_default.value);

				if (product.remaining >= total_quantity) {
					await db.sequelize.transaction(async (transaction) => {
						const carts = await CARTS.create(
							{
								unique_id: uuidv4(),
								user_unique_id: null,
								...payload,
								shipping_fee: shipping_fee,
								status: default_status
							}, { transaction }
						);

						if (carts) {
							SuccessResponse(res, { unique_id: anonymous, text: "Cart added successfully!" }, { unique_id: carts.unique_id });
						} else {
							throw new Error("Error adding cart!");
						}
					});
				} else {
					BadRequestError(res, { unique_id: anonymous, text: "Product is out of stock!" }, null);
				}
			} else {
				BadRequestError(res, { unique_id: anonymous, text: "App Default for Shipping Fee not found!" }, null);
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function deleteCart(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const cart = await CARTS.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (cart > 0) {
					OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Cart was deleted successfully!" });
				} else {
					throw new Error("Error deleting cart");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function clearCart(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const cart = await CARTS.destroy(
					{
						where: {
							user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (cart > 0) {
					OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Cart was deleted successfully!" });
				} else {
					throw new Error("Error deleting cart");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};