import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import { default_delete_status, default_status, tag_root, true_status, false_status, paginate, return_all_letters_uppercase } from '../config/config.js';
import db from "../models/index.js";

const FAVORITES = db.favorites;
const USERS = db.users;
const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const Op = db.Sequelize.Op;

export async function rootGetFavorites(req, res) {
	const total_records = await FAVORITES.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	FAVORITES.findAndCountAll({
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
						attributes: ['name', 'image', 'stripped']
					},
				]
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(favorites => {
		if (!favorites || favorites.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Favorites Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Favorites loaded" }, { ...favorites, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetFavorite(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		FAVORITES.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.favorite_unique_id,
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
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			]
		}).then(favorite => {
			if (!favorite) {
				NotFoundError(res, { unique_id: tag_root, text: "Favorite not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Favorite loaded" }, favorite);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetFavoritesSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await FAVORITES.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		FAVORITES.findAndCountAll({
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
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(favorites => {
			if (!favorites || favorites.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Favorites Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Favorites loaded" }, { ...favorites, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function getFavorites(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await FAVORITES.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	FAVORITES.findAndCountAll({
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
						attributes: ['name', 'image', 'stripped']
					},
				]
			},
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(favorites => {
		if (!favorites || favorites.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Favorites Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Favorites loaded" }, { ...favorites, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getFavoritesSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await FAVORITES.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		FAVORITES.findAndCountAll({
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
							attributes: ['name', 'image', 'stripped']
						},
					]
				},
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(favorites => {
			if (!favorites || favorites.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Favorites Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Favorites loaded" }, { ...favorites, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getFavorite(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		FAVORITES.findOne({
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
							attributes: ['name', 'image', 'stripped']
						},
					]
				}
			]
		}).then(favorite => {
			if (!favorite) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Favorite not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Favorite loaded" }, favorite);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export async function addFavorite(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {

				const last_favorite = await FAVORITES.findOne({
					where: {
						user_unique_id: payload.user_unique_id,
						product_unique_id: payload.product_unique_id,
						status: default_status
					},
					transaction
				});

				if (last_favorite) {
					const product_favorites = await PRODUCTS.decrement({ favorites: 1 }, { where: { unique_id: payload.product_unique_id }, transaction });

					const favorite = await FAVORITES.destroy(
						{
							where: {
								unique_id: last_favorite.unique_id,
								user_unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (favorite > 0) {
						OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Favorite was deleted successfully!" });
					} else {
						throw new Error("Error deleting favorite");
					}
				} else {
					const product_favorites = await PRODUCTS.increment({ favorites: 1 }, { where: { unique_id: payload.product_unique_id }, transaction });

					const favorite = await FAVORITES.create(
						{
							...payload,
							unique_id: uuidv4(),
							user_unique_id,
							status: default_status
						}, { transaction }
					);

					if (favorite) {
						CreationSuccessResponse(res, { unique_id: user_unique_id, text: "Favorite added successfully!" });
					} else {
						throw new Error("Error adding favorite");
					}
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};

export async function deleteFavorite(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {

				const product_favorites = await PRODUCTS.decrement({ favorites: 1 }, { where: { unique_id: payload.product_unique_id }, transaction });

				const favorite = await FAVORITES.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							user_unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (favorite > 0) {
					OtherSuccessResponse(res, { unique_id: user_unique_id, text: "Favorite was deleted successfully!" });
				} else {
					throw new Error("Error deleting favorite");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		}
	}
};