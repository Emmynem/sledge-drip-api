import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, tag_root, true_status, false_status, paginate, return_all_letters_uppercase, ratings, anonymous, return_bulk_rating_images_array,
	return_multiple_rating_array
} from '../config/config.js';
import db from "../models/index.js";
import { deleteImage } from '../middleware/uploads.js';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

const RATINGS = db.ratings;
const RATING_IMAGES = db.rating_images;
const USERS = db.users;
const ORDERS = db.orders;
const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const Op = db.Sequelize.Op;

export async function rootGetRatings(req, res) {
	const total_records = await RATINGS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	RATINGS.findAndCountAll({
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
				model: ORDERS,
				attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
			},
			{
				model: PRODUCTS,
				attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
			{
				model: RATING_IMAGES,
				attributes: ['unique_id', 'image']
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(ratings => {
		if (!ratings || ratings.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Ratings Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Ratings loaded" }, { ...ratings, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetRating(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		RATINGS.findOne({
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
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				{
					model: RATING_IMAGES,
					attributes: ['unique_id', 'image']
				},
			]
		}).then(rating => {
			if (!rating) {
				NotFoundError(res, { unique_id: tag_root, text: "Rating not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Rating loaded" }, rating);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetRatingsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await RATINGS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		RATINGS.findAndCountAll({
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
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				{
					model: RATING_IMAGES,
					attributes: ['unique_id', 'image']
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(ratings => {
			if (!ratings || ratings.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Ratings Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Ratings loaded" }, { ...ratings, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function getRatings(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await RATINGS.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	RATINGS.findAndCountAll({
		attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
		where: {
			user_unique_id
		},
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: ORDERS,
				attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
			},
			{
				model: PRODUCTS,
				attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
			{
				model: RATING_IMAGES,
				attributes: ['unique_id', 'image']
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(ratings => {
		if (!ratings || ratings.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Ratings Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Ratings loaded" }, { ...ratings, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getRatingsSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await RATINGS.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		RATINGS.findAndCountAll({
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
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				{
					model: RATING_IMAGES,
					attributes: ['unique_id', 'image']
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(ratings => {
			if (!ratings || ratings.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Ratings Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Ratings loaded" }, { ...ratings, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getRating(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		RATINGS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				user_unique_id,
				...payload,
			},
			include: [
				{
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				},
				{
					model: PRODUCTS,
					attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
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
				{
					model: RATING_IMAGES,
					attributes: ['unique_id', 'image']
				},
			]
		}).then(rating => {
			if (!rating) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Rating not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Rating loaded" }, rating);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function publicGetRatingsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await RATINGS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		RATINGS.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id', 'updatedAt'] },
			where: {
				...payload,
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				// {
				// 	model: ORDERS,
				// 	attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
				// 	include: [
				// 		{
				// 			model: PRODUCTS,
				// 			attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
				// 			include: [
				// 				{
				// 					model: PRODUCT_IMAGES,
				// 					attributes: ['image']
				// 				},
				// 				{
				// 					model: CATEGORIES,
				// 					attributes: ['name', 'image', 'stripped']
				// 				},
				// 			]
				// 		},
				// 	]
				// },
				// {
				// 	model: PRODUCTS,
				// 	attributes: ['name', 'stripped', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
				// 	include: [
				// 		{
				// 			model: PRODUCT_IMAGES,
				// 			attributes: ['image']
				// 		},
				// 		{
				// 			model: CATEGORIES,
				// 			attributes: ['name', 'image', 'stripped']
				// 		},
				// 	]
				// },
				{
					model: RATING_IMAGES,
					attributes: ['unique_id', 'image']
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(ratings => {
			if (!ratings || ratings.length == 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Ratings Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Ratings loaded" }, { ...ratings, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicGetRatingStatsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_ratings = await RATINGS.count({ where: { ...payload } });
		const total_ratings_via_rating = await RATINGS.findAll({
			attributes: ["rating", [db.sequelize.fn('count', db.sequelize.col('id')), 'total_count']],
			where: { ...payload },
			group: "rating"
		});

		SuccessResponse(res, { unique_id: anonymous, text: "Rating stats loaded" }, { total_ratings, total_ratings_via_rating });
	}
};

export async function addRating(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const order_details = await ORDERS.findOne({
				where: {
					unique_id: payload.order_unique_id,
					status: default_status
				}
			});

			const last_rating = await RATINGS.findOne({
				where: {
					user_unique_id: user_unique_id,
					product_unique_id: payload.product_unique_id,
					order_unique_id: payload.order_unique_id,
					status: default_status
				}
			});

			if (last_rating) {
				await db.sequelize.transaction(async (transaction) => {
					const rating = await RATINGS.update(
						{
							fullname: payload.fullname ? payload.fullname : (order_details ? order_details.contact_fullname : null),
							...payload,
							description: payload.description ? payload.description : null
						}, {
						where: {
							unique_id: last_rating.unique_id,
							user_unique_id,
							status: default_status
						},
						transaction
					}
					);

					if (rating > 0) {
						SuccessResponse(res, { unique_id: user_unique_id, text: "Rating was updated successfully!" }, { unique_id: last_rating.unique_id });
					} else {
						throw new Error("Error updating rating");
					}
				});
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const rating_unique_id = uuidv4();

					const rating = await RATINGS.create(
						{
							unique_id: rating_unique_id,
							user_unique_id,
							fullname: payload.fullname ? payload.fullname : (order_details ? order_details.contact_fullname : null),
							...payload,
							description: payload.description ? payload.description : null,
							status: default_status
						}, { transaction }
					);

					if (rating) {
						SuccessResponse(res, { unique_id: user_unique_id, text: "Rating added successfully!" }, { unique_id: rating_unique_id });
					} else {
						throw new Error("Error adding rating");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function addExternalRating(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const order_details = await ORDERS.findOne({
				where: {
					unique_id: payload.order_unique_id,
					status: default_status
				}
			});

			const last_rating = await RATINGS.findOne({
				where: {
					product_unique_id: payload.product_unique_id,
					order_unique_id: payload.order_unique_id,
					status: default_status
				}
			});

			if (last_rating) {
				await db.sequelize.transaction(async (transaction) => {
					const rating = await RATINGS.update(
						{
							fullname: payload.fullname ? payload.fullname : (order_details ? order_details.contact_fullname : null),
							...payload,
							description: payload.description ? payload.description : null
						}, {
						where: {
							unique_id: last_rating.unique_id,
							status: default_status
						},
						transaction
					}
					);

					if (rating > 0) {
						SuccessResponse(res, { unique_id: anonymous, text: "Rating was updated successfully!" }, { unique_id: last_rating.unique_id });
					} else {
						throw new Error("Error updating rating");
					}
				});
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const rating_unique_id = uuidv4();

					const rating = await RATINGS.create(
						{
							unique_id: rating_unique_id,
							user_unique_id: null,
							fullname: payload.fullname ? payload.fullname : (order_details ? order_details.contact_fullname : null),
							...payload,
							description: payload.description ? payload.description : null,
							status: default_status
						}, { transaction }
					);

					if (rating) {
						SuccessResponse(res, { unique_id: anonymous, text: "Rating added successfully!" }, { unique_id: rating_unique_id });
					} else {
						throw new Error("Error adding rating");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function addMultipleRatings(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const ratings = await RATINGS.bulkCreate(return_multiple_rating_array(payload.ratings, { product_unique_id: payload.product_unique_id }), { transaction });

				if (ratings.length > 0) {
					SuccessResponse(res, { unique_id: anonymous, text: "Ratings created successfully!" });
				} else {
					throw new Error("Error adding ratings");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function uploadRatingImages(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const rating_images = await RATING_IMAGES.bulkCreate(return_bulk_rating_images_array(payload.rating_images, { rating_unique_id: payload.rating_unique_id }), { transaction });

				if (rating_images.length > 0) {
					SuccessResponse(res, { unique_id: anonymous, text: "Rating images created successfully!" });
				} else {
					throw new Error("Error adding rating images");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function deleteRatingImage(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const rating_image_details = await RATING_IMAGES.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!rating_image_details) {
				NotFoundError(res, { unique_id: anonymous, text: "Rating Image not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const rating_image = await RATING_IMAGES.destroy(
						{
							where: {
								unique_id: payload.unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (rating_image > 0) {
						OtherSuccessResponse(res, { unique_id: anonymous, text: "Rating Image was deleted successfully!" });

						// Delete former image available
						if (rating_image_details.image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: rating_image_details.image_public_id });
						}
					} else {
						throw new Error("Error deleting rating image");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function deleteRating(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const rating_details = await RATINGS.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!rating_details) {
				NotFoundError(res, { unique_id: anonymous, text: "Rating not found" }, null);
			} else {
				const rating_images = await RATING_IMAGES.findAll({
					where: {
						rating_unique_id: payload.unique_id
					}
				});

				if (!rating_images || rating_images.length === 0) {
					await db.sequelize.transaction(async (transaction) => {
						const rating = await RATINGS.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (rating > 0) {
							OtherSuccessResponse(res, { unique_id: anonymous, text: "Rating was deleted successfully!" });
						} else {
							throw new Error("Error deleting rating");
						}
					});
				} else {
					await db.sequelize.transaction(async (transaction) => {
						for (let index = 0; index < rating_images.length; index++) {
							const rating_image_element = rating_images[index];

							// Delete former file available
							if (rating_image_element.image_public_id !== null) {
								await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: rating_image_element.image_public_id });
							}

							if (index === rating_images.length - 1) {
								const rating_image = await RATING_IMAGES.destroy(
									{
										where: {
											rating_unique_id: payload.unique_id
										},
										transaction
									}
								);
							}
						}

						const rating = await RATINGS.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (rating > 0) {
							OtherSuccessResponse(res, { unique_id: anonymous, text: "Rating was deleted successfully!" });
						} else {
							throw new Error("Error deleting rating");
						}
					});
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};